import DcClientHandler from './DcClientHandler';

export default class CommandsHandler {
  private readonly _instance: DcClientHandler;
  private readonly _config: TCommandsHandlerConfig;

  constructor(instance: DcClientHandler, config: TCommandsHandlerConfig) {
    this._instance = instance;
    this._config = config;
  }
}

export type TCommandsHandlerConfig = {
  commandsDir: string;
  commandPrefix: string;
};
