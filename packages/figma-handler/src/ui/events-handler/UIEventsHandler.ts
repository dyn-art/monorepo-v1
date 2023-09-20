import { uuidv4 } from '@dyn/utils';
import FigmaUIHandler from '../FigmaUIHandler';
import { uiLogger } from '../logger';
import UIEvent, { TUIEventMeta } from './UIEvent';
import defaultEvents from './events';

export default class UIEventsHandler {
  private readonly _instance: FigmaUIHandler;

  private _events: Map<string, UIEvent> = new Map();

  constructor(instance: FigmaUIHandler, events: TUIEventMeta[] = []) {
    this._instance = instance;
    this.initializeEvents([...defaultEvents, ...events]);
  }

  private async initializeEvents(events: TUIEventMeta[]) {
    // Create Events
    for (const meta of events) {
      const event = this.createEvent(meta);
      this._events.set(event.key, event);
    }

    // Register Events
    this.registerEvents(Array.from(this._events.values()));

    uiLogger.info('Registered Events', {
      events: Array.from(this._events.values()).map((event) => event.key),
    });
  }

  public registerEvent(meta: TUIEventMeta) {
    const event = this.createEvent(meta);
    this.registerEvents([event]);
    uiLogger.info('Registered Event', { event });
  }

  private createEvent(meta: TUIEventMeta) {
    let key = meta?.key ?? uuidv4();
    if (this._events.has(key)) {
      const previousKey = key;
      key = `${key}_${uuidv4()}`;
      uiLogger.warn(
        `The Event name '${previousKey}' has already been used! The Event has been renamed to '${key}'.`
      );
    }
    return new UIEvent(this._instance, key, meta);
  }

  private registerEvents(events: UIEvent[]) {
    for (const event of events) {
      let type: string = event.meta.type;
      const typeParts = type.split('.');
      if (typeParts.length === 2) {
        type = typeParts[1];
      }

      // Directly calling global 'addEventListener' because if parent.x is called
      // the "Uncaught (in promise) DOMException: Blocked a frame with origin "null" from accessing a cross-origin frame."
      // error is thrown
      addEventListener(type as any, (...args) => {
        this.onEvent(event, args);
      });
    }
  }

  private async onEvent(event: UIEvent, args: any[]) {
    const { meta } = event;
    if (
      meta.shouldExecuteCallback == null ||
      // @ts-ignore (Expression produces a union type that is too complex to represent.)
      meta.shouldExecuteCallback(...args)
    ) {
      if (meta.type === 'figma.message') {
        const data = args[0]?.data;
        const pluginMessage = data?.pluginMessage;
        if (
          pluginMessage != null &&
          pluginMessage?.key === event.key &&
          typeof pluginMessage?.args === 'object'
        ) {
          meta.callback(this._instance, {
            pluginId: data?.pluginId,
            ...pluginMessage.args,
          });
        }
      } else {
        // @ts-ignore (Expression produces a union type that is too complex to represent.)
        meta.callback(this._instance, ...args);
      }
    }
  }
}

export type TUIEventsHandlerConfig = {
  events?: TUIEventMeta[];
};
