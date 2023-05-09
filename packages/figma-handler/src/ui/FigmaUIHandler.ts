import { TBaseUIMessageEvent } from '../types';

export default class FigmaUIHandler<
  TUIMessageEvent extends TBaseUIMessageEvent = TBaseUIMessageEvent
> {
  private readonly _parent: Window;

  constructor(parentInstance: Window) {
    this._parent = parentInstance;
  }

  public get parent() {
    return this._parent;
  }

  public postMessage<TKey extends TUIMessageEvent['key']>(
    key: TKey,
    args: Extract<TUIMessageEvent, { key: TKey }>['args']
  ) {
    this._parent.postMessage({ pluginMessage: { key, args } }, '*');
  }
}
