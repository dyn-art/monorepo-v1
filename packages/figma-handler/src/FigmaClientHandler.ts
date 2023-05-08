import { TEventMeta } from './events-handler';
import EventsHandler from './events-handler/EventsHandler';

export default class FigmaClientHandler {
  private readonly _client: typeof figma;

  private _eventsHandler?: EventsHandler;

  constructor(client: typeof figma, config: TFigmaClientHandlerConfig = {}) {
    const { events = [] } = config;
    this._client = client;
    this.initEvents(events);
  }

  public get client() {
    return this._client;
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
