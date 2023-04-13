import { Client } from 'discord.js';
import Command from './Command';
import { TCommandsHandlerConfig } from './CommandsHandler';
import { defineConfig } from './utils/define-config';

export default class DcClientHandler {
  private readonly _client: Client;
  private readonly _config: TDcClientHandlerConfig;

  private _adminIds: string[] = [];

  private _commands: { [key: string]: Command } = {};

  constructor(config: TDcClientHandlerConstructorConfig) {
    const _config = defineConfig(config, {
      commands: {
        commandsDir: 'commands',
        commandPrefix: 'pda.',
      },
      eventsDir: 'events',
      fileSuffixes: ['.ts', '.js'],
      adminIds: [],
    });

    this._client = _config.client as Client;
    this._config = {
      fileSuffixes: _config.fileSuffixes,
    };

    this.initAdmins(_config.adminIds);
    this.initCommands(
      _config.commands.commandPrefix,
      _config.commands.commandPrefix
    );
    this.initEvents(_config.eventsDir);
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

  private async initCommands(commandsDir: string, commandPrefix: string) {
    // TODO
  }

  private async initEvents(eventsDir: string) {
    // TODO
  }
}

type TDcClientHandlerConstructorConfig = {
  client: Client;
  adminIds?: string[];
  eventsDir?: string;
  commands?: Partial<TCommandsHandlerConfig>;
} & Partial<TDcClientHandlerConfig>;

type TDcClientHandlerConfig = {
  fileSuffixes: string[];
};
