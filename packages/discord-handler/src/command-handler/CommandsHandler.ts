import { ApplicationCommand, CommandInteraction, Message } from 'discord.js';
import DcClientHandler from '../DcClientHandler';
import { logger } from '../logger';
import { flattenFileTree, getFilesTree } from '../utils/get-file-tree';
import Command, {
  TCommandArg,
  TCommandMeta,
  TCommandMetaLegacy,
  TCommandMetaLegacyCallbackReturnType,
  TCommandMetaSlash,
  TCommandMetaSlashCallbackReturnType,
  TCommandUsage,
  TCommandUsageBase,
  isCommandMeta,
  isLegacyCommand,
  isSlashCommand,
} from './Command';
import CommandType from './CommandType';
import SlashCommandHelper from './SlashCommandHelper';

export default class CommandsHandler {
  private readonly _instance: DcClientHandler;
  private readonly _slashCommandHelper: SlashCommandHelper;
  public readonly config: TCommandsHandlerConfig;

  // Note: Not doing shared _commands map as the same command name might exist
  // as both: legacy and slash command
  private _slashCommands: Map<string, Command<TCommandMetaSlash>> = new Map();
  private _legacyCommands: Map<string, Command<TCommandMetaLegacy>> = new Map();

  constructor(instance: DcClientHandler, config: TCommandsHandlerConfig) {
    this._instance = instance;
    this._slashCommandHelper = new SlashCommandHelper(this._instance.client);
    this.config = config;

    this.initializeCommandsFromDirectory(
      this.config.commandsDir,
      this.config.fileSuffixes
    );
  }

  public get slashCommands(): ReadonlyMap<string, Command<TCommandMetaSlash>> {
    return this._slashCommands;
  }

  public get legacyCommands(): ReadonlyMap<
    string,
    Command<TCommandMetaLegacy>
  > {
    return this._legacyCommands;
  }

  public get commands(): ReadonlyArray<Command> {
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
            command,
          });
        }

        // Add Slash Command
        if (isSlashCommand(command)) {
          if (!this._slashCommands.has(command.name)) {
            this._slashCommands.set(command.name, command);
          } else {
            logger.error(
              `The command name '${command.name}' has already been used as Slash Command. Please choose a unique name to avoid conflicts.`
            );
          }
        }

        // Add Legacy Command
        if (isLegacyCommand(command)) {
          if (!this._legacyCommands.has(command.name)) {
            this._legacyCommands.set(command.name, command);
          } else {
            logger.error(
              `The command name '${command.name}' has already been used as Legacy Command. Please choose a unique name to avoid conflicts.`
            );
          }
        }
      }
    }

    // Remove unused SlashCommands
    await this.removeUnusedSlashCommands(
      Array.from(this._slashCommands.values()).map((value) => value.name)
    );

    // Register SlashCommands
    await Promise.all(
      this.commands.map((command) => this.registerSlashCommand(command))
    );

    logger.info('Registered Commands', {
      commands: this.commands.map(
        (command) =>
          `${
            command.meta.type === CommandType.SLASH
              ? '/'
              : this.config.commandPrefix ?? ''
          }${command.name}`
      ),
    });
  }

  private async registerSlashCommand(command: Command) {
    if (!isSlashCommand(command)) {
      return;
    }
    const { meta } = command;

    const options = meta.argsOptions ?? [];

    // If 'testOnly', register SlashCommand only to test servers
    if (meta.testOnly) {
      for (const guildId of this._instance.testGuildIds) {
        this._slashCommandHelper.create(
          command.name,
          meta.description ?? 'No description provided.',
          options,
          guildId
        );
      }
    }
    // Otherwise register SlashCommand globally
    else {
      this._slashCommandHelper.create(
        command.name,
        meta.description ?? 'not-set',
        options
      );
    }
  }

  private async getUnusedSlashCommands(
    usedCommandNames: string[],
    guildId?: string
  ): Promise<ApplicationCommand[]> {
    const previousCommands = await this._slashCommandHelper.getCommands(
      guildId
    );
    let unusedCommands: ApplicationCommand[] = [];
    if (previousCommands != null) {
      unusedCommands = Array.from(
        previousCommands.cache.filter(
          (command) => !usedCommandNames.includes(command.name)
        ),
        ([, value]) => value
      );
    }
    return unusedCommands;
  }

  private async removeUnusedSlashCommands(usedCommandNames: string[]) {
    const globalToRemove = await this.getUnusedSlashCommands(usedCommandNames);
    if (globalToRemove.length <= 0) return;

    // Remove globally not used SlashCommands from the DiscordAPI
    for (const command of globalToRemove) {
      this._slashCommandHelper.delete(command.name);
    }

    // Remove test only not used SlashCommands from the DiscordAPI
    for (const guildId of this._instance.testGuildIds) {
      const testOnlyToRemove = await this.getUnusedSlashCommands(
        usedCommandNames,
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

  private createCommand(fileName: string, meta: TCommandMeta): Command | null {
    // Parse Command name
    let name = (meta.name ?? fileName).toLowerCase();
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
    return new Command(this._instance, name, meta);
  }

  public async runCommand(
    command: Command<TCommandMetaLegacy>,
    args: string[] | Map<string, TCommandArg>,
    text: string,
    message: Message
  ): Promise<TCommandMetaLegacyCallbackReturnType>;
  public async runCommand(
    command: Command<TCommandMetaSlash>,
    args: string[] | Map<string, TCommandArg>,
    text: string,
    interaction: CommandInteraction
  ): Promise<TCommandMetaSlashCallbackReturnType>;
  public async runCommand(
    command: Command<TCommandMetaLegacy | TCommandMetaSlash>,
    args: string[] | Map<string, TCommandArg>,
    text: string,
    messageOrInteraction: Message | CommandInteraction
  ): Promise<
    | TCommandMetaLegacyCallbackReturnType
    | TCommandMetaSlashCallbackReturnType
    | null
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
