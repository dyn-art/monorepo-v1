import { TBaseFigmaMessageEvent } from '../shared-types';
import { TUIEventMeta, UIEventsHandler } from './events-handler';

export default class FigmaUIHandler<
  TFigmaMessageEvent extends TBaseFigmaMessageEvent = TBaseFigmaMessageEvent
> {
  private readonly _parent: Window;

  private _eventsHandler?: UIEventsHandler;

  constructor(parentInstance: Window, config: TFigmaUIHandlerConfig) {
    const { events = [] } = config;
    this._parent = parentInstance;
    this._eventsHandler = new UIEventsHandler(this, events);
  }

  public get parent() {
    return this._parent;
  }

  public get eventsHandler() {
    return this._eventsHandler;
  }

  public registerEvent(meta: TUIEventMeta<TFigmaMessageEvent>) {
    this._eventsHandler?.registerEvent(meta);
  }

  public postMessage<TKey extends TFigmaMessageEvent['key']>(
    key: TKey,
    args: Extract<TFigmaMessageEvent, { key: TKey }>['args']
  ) {
    this._parent.postMessage({ pluginMessage: { key, args } }, '*');
  }
}

type TFigmaUIHandlerConfig = {
  events?: TUIEventMeta[];
};
