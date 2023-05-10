import { TBackgroundEventMeta } from './events-handler';
import BackgroundEventsHandler from './events-handler/BackgroundEventsHandler';

export default class FigmaBackgroundHandler {
  private readonly _figma: typeof figma;

  private _eventsHandler?: BackgroundEventsHandler;

  constructor(
    figmaInstance: typeof figma,
    config: TFigmaClientHandlerConfig = {}
  ) {
    const { events = [] } = config;
    this._figma = figmaInstance;
    this.initEvents(events);
  }

  public get figma() {
    return this._figma;
  }

  public get eventsHandler() {
    return this._eventsHandler;
  }

  private async initEvents(events: TBackgroundEventMeta[]) {
    this._eventsHandler = new BackgroundEventsHandler(this, events);
  }
}

type TFigmaClientHandlerConfig = {
  events?: TBackgroundEventMeta[];
};
