import { uuidv4 } from '@pda/utils';
import { logger } from '../../logger';
import FigmaBackgroundHandler from '../FigmaBackgroundHandler';
import Event, { TEventMeta } from './Event';
import defaultEvents from './events';

export default class EventsHandler {
  private readonly _instance: FigmaBackgroundHandler;

  private _events: Map<string, Event> = new Map();

  constructor(instance: FigmaBackgroundHandler, events: TEventMeta[] = []) {
    this._instance = instance;
    this.initializeEvents([...defaultEvents, ...events]);
  }

  private async initializeEvents(events: TEventMeta[]) {
    // Create Events
    for (const meta of events) {
      const event = this.createEvent(meta);
      this._events.set(event.key, event);
    }

    // Register Events
    this.registerEvents(Array.from(this._events.values()));

    logger.info('Registered Events', {
      events: Array.from(this._events.values()).map((event) => event.key),
    });
  }

  private createEvent(meta: TEventMeta) {
    let key = meta?.key ?? uuidv4();
    if (this._events.has(key)) {
      const previousKey = key;
      key = `${key}_${uuidv4()}`;
      logger.warn(
        `The Event name '${previousKey}' has already been used! The Event has been renamed to '${key}'.`
      );
    }
    return new Event(this._instance, key, meta);
  }

  private registerEvents(events: Event[]) {
    for (const event of events) {
      let type: string = event.meta.type;
      let typeCategory: string | null = null;
      const typeParts = type.split('.');
      if (typeParts.length === 2) {
        typeCategory = typeParts[0];
        type = typeParts[1];
      }

      // Register UI Events
      if (typeCategory === 'ui') {
        if (event.meta.once) {
          this._instance.client.ui.once(type as any, (...args) => {
            this.onEvent(event, args);
          });
        } else {
          this._instance.client.ui.on(type as any, (...args) => {
            this.onEvent(event, args);
          });
        }
        // Register General Events
      } else {
        if (event.meta.once) {
          this._instance.client.once(type as any, (...args) => {
            this.onEvent(event, args);
          });
        } else {
          this._instance.client.on(type as any, (...args) => {
            this.onEvent(event, args);
          });
        }
      }
    }
  }

  private async onEvent(event: Event, args: any[]) {
    if (
      event.meta.shouldExecuteCallback == null ||
      // @ts-ignore (Expression produces a union type that is too complex to represent.)
      event.meta.shouldExecuteCallback(...args)
    ) {
      // @ts-ignore (Expression produces a union type that is too complex to represent.)
      event.meta.callback(this._instance, ...args);
    }
  }
}

export type TEventsHandlerConfig = {
  events?: TEventMeta[];
};
