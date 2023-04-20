import {
  ApplicationCommand,
  CommandInteraction,
  Message,
  MessagePayload,
  MessageReplyOptions,
} from 'discord.js';
import DcClientHandler from '../DcClientHandler';
import { flattenFileTree, getFilesTree } from '../utils/get-file-tree';
import Command, { TCommandMeta, TCommandMetaBoth } from './Command';
import CommandType from './CommandType';
import SlashCommandHelper from './SlashCommandHelper';

// TODO https://github.dev/AlexzanderFlores/WOKCommands-v2

export default class CommandsHandler {
  private readonly _instance: DcClientHandler;
  private readonly _slashCommandHelper: SlashCommandHelper;
  public readonly config: TCommandsHandlerConfig;

  private _commands: Map<string, Command> = new Map();

  constructor(instance: DcClientHandler, config: TCommandsHandlerConfig) {
    this._instance = instance;
    this._slashCommandHelper = new SlashCommandHelper(this._instance.client);
    this.config = config;

    this.initializeCommandsFromDirectory(
      this.config.commandsDir,
      this.config.fileSuffixes
    );
  }

  public get commands(): ReadonlyMap<string, Command> {
    return this._commands;
  }

  private async initializeCommandsFromDirectory(
    commandsDir: string,
    fileSuffixes: string[] = []
  ) {
    const commandsFileTree = await getFilesTree(commandsDir, fileSuffixes);
    const commandFiles = flattenFileTree(commandsFileTree);

    // Create Commands
    for (const commandFile of commandFiles) {
      const meta = commandFile.content as TCommandMeta;

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

      // Add Command to commands
      if (!this._commands.has(command.name)) {
        this._commands.set(command.name, command);
      } else {
        console.error(
          `The command name '${command.name}' has already been used. Please choose a unique name to avoid conflicts.`
        );
      }
    }

    // Remove unused Commands
    const usedCommandNames = new Set(this._commands.keys());
    await this.removeUnusedSlashCommands(usedCommandNames);

    // Register SlashCommands
    await Promise.all(
      Array.from(this._commands.values()).map((command) =>
        this.registerSlashCommand(command)
      )
    );
  }

  private async registerSlashCommand(command: Command) {
    if (
      command.meta.type !== CommandType.SLASH &&
      command.meta.type !== CommandType.BOTH
    ) {
      return;
    }
    const meta = command.meta as TCommandMetaBoth;

    const options = meta.options ?? [];

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
    usedCommandNames: Set<string>,
    guildId?: string
  ): Promise<ApplicationCommand[]> {
    const previousCommands = await this._slashCommandHelper.getCommands(
      guildId
    );
    let unusedCommands: ApplicationCommand[] = [];
    if (previousCommands != null) {
      unusedCommands = previousCommands.cache
        .filter((command) => !usedCommandNames.has(command.name))
        .map((command) => command[1]); // Map to ApplicationCommand
    }
    return unusedCommands;
  }

  private async removeUnusedSlashCommands(usedCommandNames: Set<string>) {
    const globalToRemove = await this.getUnusedSlashCommands(usedCommandNames);

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
  }

  private createCommand(fileName: string, meta: TCommandMeta): Command | null {
    // Parse Command name
    const name = (meta.name ?? fileName)
      .toLowerCase()
      .replace(/\W/g, '-') // Replace none letters, digits, and underscores with '-' (https://www.w3schools.com/jsref/jsref_regexp_wordchar.asp)
      .replace(/^[-_]+|[-_]+$/g, ''); // Replace starting and ending '-' or '_'
    if (
      (meta.type === CommandType.SLASH || meta.type === CommandType.BOTH) &&
      name.length > 32
    ) {
      console.error(
        `Slash command names must be no more than 32 characters. The provided command name '${name}' is ${name.length} characters long.`
      );
      return null;
    }

    // Create Command instance
    return new Command(this._instance, name, meta);
  }

  public async runCommand(
    command: Command,
    args: string[],
    message: Message | null,
    interaction: CommandInteraction | null
  ): Promise<string | MessagePayload | MessageReplyOptions | null> {
    // TODO: run commands

    return null;
  }
}

export type TCommandsHandlerConfig = {
  commandsDir: string;
  commandPrefix?: string;
  fileSuffixes?: string[];
};
