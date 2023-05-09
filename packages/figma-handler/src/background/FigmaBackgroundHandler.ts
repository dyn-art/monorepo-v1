import { TEventMeta } from './events-handler';
import EventsHandler from './events-handler/EventsHandler';

export default class FigmaBackgroundHandler {
  private readonly _figma: typeof figma;

  private _eventsHandler?: EventsHandler;

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

  private async initEvents(events: TEventMeta[]) {
    this._eventsHandler = new EventsHandler(this, events);
  }
}

type TFigmaClientHandlerConfig = {
  events?: TEventMeta[];
};
