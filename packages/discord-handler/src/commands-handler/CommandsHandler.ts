import { flattenFileTree, getFilesTree } from '@pda/utils';
import { ApplicationCommand, CommandInteraction, Message } from 'discord.js';
import DcClientHandler from '../DcClientHandler';
import {
  TComponentButtonMeta,
  TComponentModalMeta,
} from '../components-handler';
import { logger } from '../logger';
import CommandType from './CommandType';
import SlashCommandHelper from './SlashCommandHelper';
import {
  BaseCommand,
  LegacyCommand,
  SlashCommand,
  TCommandArg,
  TCommandLegacyCallbackReturnType,
  TCommandMeta,
  TCommandSlashCallbackReturnType,
  TCommandUsage,
  TCommandUsageBase,
  isCommandMeta,
  isLegacyCommandMeta,
  isSlashCommandMeta,
} from './command-types';

export default class CommandsHandler {
  private readonly _instance: DcClientHandler;
  private readonly _slashCommandHelper: SlashCommandHelper;
  public readonly config: TCommandsHandlerConfig;

  // Note: Not doing shared _commands map as the same command key might exist
  // as both: legacy and slash command
  private _slashCommands: Map<string, SlashCommand> = new Map();
  private _legacyCommands: Map<string, LegacyCommand> = new Map();

  constructor(instance: DcClientHandler, config: TCommandsHandlerConfig) {
    this._instance = instance;
    this._slashCommandHelper = new SlashCommandHelper(this._instance.client);
    this.config = config;

    this.initializeCommandsFromDirectory(
      this.config.commandsDir,
      this.config.fileSuffixes
    );
  }

  public get slashCommands(): ReadonlyMap<string, SlashCommand> {
    return this._slashCommands;
  }

  public get legacyCommands(): ReadonlyMap<string, LegacyCommand> {
    return this._legacyCommands;
  }

  public get commands(): ReadonlyArray<BaseCommand> {
    return [...this._slashCommands.values(), ...this._legacyCommands.values()];
  }

  private async initializeCommandsFromDirectory(
    commandsDir: string,
    fileSuffixes: string[] = []
  ) {
    const commandsFileTree = await getFilesTree(commandsDir, {
      suffixes: fileSuffixes,
    });
    const commandFiles = flattenFileTree(commandsFileTree);

    // Create Commands
    for (const commandFile of commandFiles) {
      const fileContent = commandFile.content;
      const metas: TCommandMeta[] = [];

      // Try to extract meta objects from file content
      if (Array.isArray(fileContent)) {
        for (const content of fileContent) {
          if (isCommandMeta(content)) {
            metas.push(content);
          }
        }
      } else if (isCommandMeta(fileContent)) {
        metas.push(fileContent);
      }

      if (metas.length <= 0) {
        logger.warn(
          `Couldn't find valid meta object in file '${commandFile.name}' at '${commandFile.path}'!`
        );
      }

      for (const meta of metas) {
        // Initialize Command
        const command = this.createCommand(commandFile.name, meta);
        if (command == null) continue;

        // Init
        if (meta.onInit != null) {
          await meta.onInit({
            client: this._instance.client,
            instance: this._instance,
            command: command as any,
          });
        }

        // Add Slash Command
        if (command instanceof SlashCommand) {
          if (!this._slashCommands.has(command.key)) {
            this._slashCommands.set(command.key, command);
          } else {
            logger.error(
              `The command name '${command.key}' has already been used as Slash Command! Choose a unique name to avoid conflicts.`
            );
          }
        }

        // Add Legacy Command
        if (command instanceof LegacyCommand) {
          if (!this._legacyCommands.has(command.key)) {
            this._legacyCommands.set(command.key, command);
          } else {
            logger.error(
              `The command name '${command.key}' has already been used as Legacy Command! Choose a unique name to avoid conflicts.`
            );
          }
        }
      }
    }

    // Remove unused SlashCommands
    await this.removeUnusedSlashCommands(
      Array.from(this._slashCommands.values()).map((value) => value.key)
    );

    // Register SlashCommands
    await Promise.all(
      Array.from(this._slashCommands.values()).map((command) =>
        this.registerSlashCommand(command)
      )
    );

    logger.info('Registered Commands', {
      commands: this.commands.map(
        (command) =>
          `${
            command instanceof SlashCommand
              ? '/'
              : this.config.commandPrefix ?? ''
          }${command.key}`
      ),
    });
  }

  private async registerSlashCommand(command: SlashCommand) {
    const { meta } = command;

    const options = meta.argsOptions ?? [];

    // If 'testOnly', register SlashCommand only to test servers
    if (meta.testOnly) {
      for (const guildId of this._instance.testGuildIds) {
        this._slashCommandHelper.create(
          command.key,
          meta.description ?? 'No description provided.',
          options,
          guildId
        );
      }
    }
    // Otherwise register SlashCommand globally
    else {
      this._slashCommandHelper.create(
        command.key,
        meta.description ?? 'not-set',
        options
      );
    }
  }

  private async getUnusedSlashCommands(
    usedCommandKeys: string[],
    guildId?: string
  ): Promise<ApplicationCommand[]> {
    const previousCommands = await this._slashCommandHelper.getCommands(
      guildId
    );
    let unusedCommands: ApplicationCommand[] = [];
    if (previousCommands != null) {
      unusedCommands = Array.from(
        previousCommands.cache.filter(
          (command) => !usedCommandKeys.includes(command.name)
        ),
        ([, value]) => value
      );
    }
    return unusedCommands;
  }

  private async removeUnusedSlashCommands(usedCommandKeys: string[]) {
    const globalToRemove = await this.getUnusedSlashCommands(usedCommandKeys);
    if (globalToRemove.length <= 0) return;

    // Remove globally not used SlashCommands from the DiscordAPI
    for (const command of globalToRemove) {
      this._slashCommandHelper.delete(command.name);
    }

    // Remove test only not used SlashCommands from the DiscordAPI
    for (const guildId of this._instance.testGuildIds) {
      const testOnlyToRemove = await this.getUnusedSlashCommands(
        usedCommandKeys,
        guildId
      );
      for (const command of testOnlyToRemove) {
        this._slashCommandHelper.delete(command.name, guildId);
      }
    }

    logger.info('Removed unused SlashCommands', {
      slashCommands: globalToRemove.map((command) => command.name),
    });
  }

  private createCommand(
    fileName: string,
    meta: TCommandMeta
  ): BaseCommand | null {
    // Parse Command name
    let name = (meta.key ?? fileName).toLowerCase();
    if (meta.type === CommandType.SLASH) {
      name = name
        .replace(/\W/g, '-') // Replace none letters, digits, and underscores with '-' (https://www.w3schools.com/jsref/jsref_regexp_wordchar.asp)
        .replace(/^[-_]+|[-_]+$/g, ''); // Replace starting and ending '-' or '_'
      if (name.length > 32) {
        logger.error(
          `Slash command names must be no more than 32 characters. The provided command name '${name}' is ${name.length} characters long.`
        );
        return null;
      }
    }

    // Create Command instance
    let command: BaseCommand | null = null;
    if (isLegacyCommandMeta(meta)) {
      command = new LegacyCommand(this._instance, name, meta);
    } else if (isSlashCommandMeta(meta)) {
      command = new SlashCommand(this._instance, name, meta);
    }

    return command;
  }

  public async runCommand(
    command: LegacyCommand,
    args: string[] | Map<string, TCommandArg>,
    text: string,
    message: Message
  ): Promise<TCommandLegacyCallbackReturnType>;
  public async runCommand(
    command: SlashCommand,
    args: string[] | Map<string, TCommandArg>,
    text: string,
    interaction: CommandInteraction
  ): Promise<TCommandSlashCallbackReturnType>;
  public async runCommand(
    command: BaseCommand,
    args: string[] | Map<string, TCommandArg>,
    text: string,
    messageOrInteraction: Message | CommandInteraction
  ): Promise<
    TCommandLegacyCallbackReturnType | TCommandSlashCallbackReturnType | null
  > {
    const usageBase: TCommandUsageBase = {
      client: command.instance.client,
      instance: command.instance,
      args,
      text,
      guild: messageOrInteraction.guild,
      member: messageOrInteraction.member,
      user:
        messageOrInteraction instanceof Message
          ? messageOrInteraction.author
          : messageOrInteraction.user,
      channel: messageOrInteraction.channel,
      registerButton: (meta: Omit<TComponentButtonMeta, 'type'>) => {
        this._instance.componentsHandler?.registerButton(meta);
      },
      registerModal: (meta: Omit<TComponentModalMeta, 'type'>) => {
        this._instance.componentsHandler?.registerModal(meta);
      },
    };

    let usage: TCommandUsage;
    if (messageOrInteraction instanceof Message) {
      usage = { ...usageBase, message: messageOrInteraction };
    } else {
      usage = { ...usageBase, interaction: messageOrInteraction };
    }

    const response = await command.meta.callback(usage as any);
    return response ?? null;
  }
}

export type TCommandsHandlerConfig = {
  commandsDir: string;
  commandPrefix?: string;
  fileSuffixes?: string[];
};
