import { AnyExtract, TBaseFigmaMessageEvent } from '../shared-types';
import { TBackgroundEventMeta } from './events-handler';
import BackgroundEventsHandler from './events-handler/BackgroundEventsHandler';

export default class FigmaBackgroundHandler<
  TFigmaBackgroundMessageEvent extends TBaseFigmaMessageEvent = TBaseFigmaMessageEvent,
  TFigmaUIMessageEvent extends TBaseFigmaMessageEvent = TBaseFigmaMessageEvent
> {
  private readonly _figma: typeof figma;

  private _eventsHandler?: BackgroundEventsHandler;

  constructor(
    figmaInstance: typeof figma,
    config: TFigmaBackgroundHandlerConfig = {}
  ) {
    const { events = [] } = config;
    this._figma = figmaInstance;
    this._eventsHandler = new BackgroundEventsHandler(this, events);
  }

  public get figma() {
    return this._figma;
  }

  public get eventsHandler() {
    return this._eventsHandler;
  }

  public registerEvent(
    meta: TBackgroundEventMeta<
      TFigmaBackgroundMessageEvent,
      TFigmaUIMessageEvent
    >
  ) {
    this._eventsHandler?.registerEvent(meta);
  }

  public postMessage<TKey extends TFigmaUIMessageEvent['key']>(
    key: TKey,
    args: AnyExtract<TFigmaUIMessageEvent, { key: TKey }>['args']
  ) {
    this._figma.ui.postMessage({ key, args });
  }
}

type TFigmaBackgroundHandlerConfig = {
  events?: TBackgroundEventMeta[];
};
