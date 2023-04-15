import { Client } from 'discord.js';
import CommandsHandler from './commands/CommandsHandler';
import EventsHandler from './events/EventsHandler';
import { defineConfig } from './utils/define-config';

export default class DcClientHandler {
  private readonly _client: Client;

  private _adminIds: string[] = [];
  private _testServerIds: string[] = [];

  private _commandsHandler?: CommandsHandler;
  private _eventsHandler?: EventsHandler;

  constructor(client: Client, config: TDcClientHandlerConfig = {}) {
    const _config = defineConfig(config, {
      commands: {
        commandsDir: 'commands',
        commandPrefix: 'pda.',
        fileSuffixes: ['.ts', '.js'],
      },
      events: {
        eventsDir: 'events',
        fileSuffixes: ['.ts', '.js'],
      },
      adminIds: [],
      testServerIds: [],
    });

    this._client = client;
    this._testServerIds = _config.testServerIds;

    this.initAdmins(_config.adminIds);
    this.initCommands(_config.commands);
    this.initEvents(_config.events);
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
    fileSuffixes?: string[];
    eventsDir?: string;
  };
  commands?: {
    commandsDir?: string;
    commandPrefix?: string;
    fileSuffixes?: string[];
  };
};
