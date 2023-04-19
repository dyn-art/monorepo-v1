import { Client } from 'discord.js';
import CommandsHandler from './commands/CommandsHandler';
import EventsHandler from './events/EventsHandler';
import { defineConfig } from './utils/define-config';

export default class DcClientHandler {
  private readonly _client: Client;

  private _adminIds: string[] = [];
  public readonly testGuildIds: string[] = [];

  private _commandsHandler?: CommandsHandler;
  private _eventsHandler?: EventsHandler;

  constructor(client: Client, config: TDcClientHandlerConfig = {}) {
    const { adminIds = [], testServerIds = [], commands, events } = config;
    const commandsConfig =
      commands != null
        ? defineConfig(commands, {
            commandPrefix: 'pda.',
            fileSuffixes: ['.ts', '.js'],
          })
        : null;
    const eventsConfig =
      events != null
        ? defineConfig(events, {
            fileSuffixes: ['.ts', '.js'],
          })
        : null;

    this._client = client;
    this.testGuildIds = testServerIds;

    this.initAdmins(adminIds);
    if (commandsConfig != null) {
      this.initCommands(commandsConfig);
    }
    if (eventsConfig) {
      this.initEvents(eventsConfig);
    }
  }

  public get client() {
    return this.client;
  }

  public get adminIds() {
    return this._adminIds;
  }

  private async initAdmins(adminIds: string[]) {
    await this._client.application?.fetch();
    const ownerId = this._client.application?.owner?.id;
    if (ownerId != null) {
      adminIds.push(ownerId);
    }
    this._adminIds = adminIds;
    return adminIds;
  }

  private async initCommands(
    config: Required<TDcClientHandlerConfig['commands']>
  ) {
    if (config == null) return;
    this._commandsHandler = new CommandsHandler(this, {
      commandPrefix: config.commandPrefix,
      commandsDir: config.commandsDir,
      fileSuffixes: config.fileSuffixes,
    });
  }

  private async initEvents(config: Required<TDcClientHandlerConfig['events']>) {
    if (config == null) return;
    this._eventsHandler = new EventsHandler(this, {
      eventsDir: config.eventsDir,
      fileSuffixes: config.fileSuffixes,
    });
  }
}

type TDcClientHandlerConfig = {
  adminIds?: string[];
  testServerIds?: string[];
  events?: {
    eventsDir: string;
    fileSuffixes?: string[];
  };
  commands?: {
    commandsDir: string;
    commandPrefix?: string;
    fileSuffixes?: string[];
  };
};
