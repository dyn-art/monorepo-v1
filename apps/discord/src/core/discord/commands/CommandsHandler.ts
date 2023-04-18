import DcClientHandler from '../DcClientHandler';
import { flattenFileTree, getFilesTree } from '../utils/get-file-tree';
import Command from './Command';

// TODO https://github.dev/AlexzanderFlores/WOKCommands-v2

export default class CommandsHandler {
  private readonly _instance: DcClientHandler;
  private readonly _config: TCommandsHandlerConfig;

  private _commands: { [key: string]: Command } = {};

  constructor(instance: DcClientHandler, config: TCommandsHandlerConfig) {
    this._instance = instance;
    this._config = config;

    this.readFiles();
  }

  private async readFiles() {
    const fileTree = await getFilesTree(
      this._config.commandsDir,
      this._config.fileSuffixes
    );
    const commandFiles = flattenFileTree(fileTree);

    console.log({ fileTree, commandFiles });

    // TODO: handle files
  }
}

export type TCommandsHandlerConfig = {
  commandsDir: string;
  commandPrefix: string;
  fileSuffixes: string[];
};
