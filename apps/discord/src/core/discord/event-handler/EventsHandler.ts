import DcClientHandler from '../DcClientHandler';
import { getFilesTree } from '../utils/get-file-tree';
import Event from './Event';

export default class EventsHandler {
  private readonly _instance: DcClientHandler;
  private readonly _config: TEventsHandlerConfig;

  private _events: { [key: string]: Event } = {};

  constructor(instance: DcClientHandler, config: TEventsHandlerConfig) {
    this._instance = instance;
    this._config = config;

    this.initializeEventsFromDirectory();
  }

  private async initializeEventsFromDirectory() {
    const fileTree = await getFilesTree(
      this._config.eventsDir,
      this._config.fileSuffixes
    );
    // TODO
  }
}

export type TEventsHandlerConfig = {
  eventsDir: string;
  fileSuffixes: string[];
};
