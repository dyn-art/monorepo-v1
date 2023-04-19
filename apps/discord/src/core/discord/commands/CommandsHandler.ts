import DcClientHandler from '../DcClientHandler';
import { flattenFileTree, getFilesTree } from '../utils/get-file-tree';
import Command, { TCommandMeta } from './Command';
import CommandType from './CommandType';
import SlashCommandHelper from './SlashCommandHelper';

// TODO https://github.dev/AlexzanderFlores/WOKCommands-v2

export default class CommandsHandler {
  private readonly _instance: DcClientHandler;
  private readonly _slashCommandHelper: SlashCommandHelper;
  private readonly _config: TCommandsHandlerConfig;

  private _commands: Map<string, Command> = new Map();

  constructor(instance: DcClientHandler, config: TCommandsHandlerConfig) {
    this._instance = instance;
    this._slashCommandHelper = new SlashCommandHelper(this._instance.client);
    this._config = config;

    this.readFiles();
  }

  private async readFiles() {
    const fileTree = await getFilesTree(
      this._config.commandsDir,
      this._config.fileSuffixes
    );
    const commandFiles = flattenFileTree(fileTree);

    const globalPreviousSlashCommands =
      await this._slashCommandHelper.getCommands();
    let globalToRemoveSlashCommandNames =
      globalPreviousSlashCommands?.cache != null
        ? globalPreviousSlashCommands.cache.map((command) => command.name)
        : [];

    // Create Commands
    for (const commandFile of commandFiles) {
      const meta = commandFile.content as TCommandMeta;
      const { description, type, testOnly, onInit } = meta;

      // Parse Command name
      const name = (meta.name ?? commandFile.name)
        .toLowerCase()
        .replace(/\W/g, '-') // Replace none letters, digits, and underscores with '-' (https://www.w3schools.com/jsref/jsref_regexp_wordchar.asp)
        .replace(/^[-_]+|[-_]+$/g, ''); // Replace starting and ending '-' or '_'
      if (
        (type === CommandType.SLASH || type === CommandType.BOTH) &&
        name.length > 32
      ) {
        console.error(
          `Slash command names must be no more than 32 characters. The provided command name '${name}' is ${name.length} characters long.`
        );
        continue;
      }

      // Create Command instance
      const command = new Command(this._instance, name, meta);

      // Init
      if (onInit != null) {
        await onInit({
          client: this._instance.client,
          instance: this._instance,
          command,
        });
      }

      if (!this._commands.has(name)) {
        this._commands.set(name, command);
      } else {
        console.error(
          `The command name '${name}' has already been used. Please choose a unique name to avoid conflicts.`
        );
      }

      // Handle SlashCommands
      if (type === CommandType.SLASH || type === CommandType.BOTH) {
        const options = meta.options ?? [];

        // If 'testOnly', register SlashCommand only to test servers
        if (testOnly) {
          for (const guildId of this._instance.testServerIds) {
            this._slashCommandHelper.create(
              name,
              description ?? 'not-set',
              options,
              guildId
            );
          }
        }
        // Otherwise register SlashCommand globally
        else {
          this._slashCommandHelper.create(
            name,
            description ?? 'not-set',
            options
          );

          // Remove SlashCommand from 'globalToRemoveSlashCommandNames' list,
          // so it doesn't get removed
          globalToRemoveSlashCommandNames =
            globalToRemoveSlashCommandNames.filter(
              (toDeleteName) => toDeleteName !== name
            );
        }
      }
    }

    // Remove globally not used SlashCommands from the DiscordAPI
    for (const toRemoveSlashCommandName of globalToRemoveSlashCommandNames) {
      await this._slashCommandHelper.delete(toRemoveSlashCommandName);
    }

    // Remove testOnly not used SlashCommands from the DiscordAPI
    // TODO:
  }
}

export type TCommandsHandlerConfig = {
  commandsDir: string;
  commandPrefix: string;
  fileSuffixes: string[];
};
