import { defineConfig } from '@pda/utils';
import EventsHandler from './events-handler/EventsHandler';
import { PluginAPI } from './types/figma';

export default class FigmaClientHandler {
  private readonly _figma: PluginAPI;

  private _eventsHandler?: EventsHandler;

  constructor(
    figmaInstance: PluginAPI,
    config: TFigmaClientHandlerConfig = {}
  ) {
    const { events } = config;
    const eventsConfig =
      events != null
        ? defineConfig(events, {
            fileSuffixes: ['.ts', '.js'],
          })
        : null;

    this._figma = figmaInstance;

    this.initEvents(eventsConfig);
  }

  public get figma() {
    return this._figma;
  }

  public get eventsHandler() {
    return this._eventsHandler;
  }

  private async initEvents(
    config: Required<TFigmaClientHandlerConfig['events']> | null
  ) {
    this._eventsHandler = new EventsHandler(this, {
      eventsDir: config?.eventsDir,
      fileSuffixes: config?.fileSuffixes,
    });
  }
}

type TFigmaClientHandlerConfig = {
  events?: {
    eventsDir: string;
    fileSuffixes?: string[];
  };
};
