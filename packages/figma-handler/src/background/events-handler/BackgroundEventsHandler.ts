import { uuidv4 } from '@dyn/utils';
import FigmaBackgroundHandler from '../FigmaBackgroundHandler';
import { backgroundLogger } from '../logger';
import BackgroundEvent, { TBackgroundEventMeta } from './BackgroundEvent';
import defaultEvents from './events';

export default class BackgroundEventsHandler {
  private readonly _instance: FigmaBackgroundHandler;

  private _events: Map<string, BackgroundEvent> = new Map();

  constructor(
    instance: FigmaBackgroundHandler,
    events: TBackgroundEventMeta[] = []
  ) {
    this._instance = instance;
    this.initializeEvents([...defaultEvents, ...events]);
  }

  private async initializeEvents(events: TBackgroundEventMeta[]) {
    // Create Events
    for (const meta of events) {
      const event = this.createEvent(meta);
      this._events.set(event.key, event);
    }

    // Register Events
    this.registerEvents(Array.from(this._events.values()));

    backgroundLogger.info('Registered Events', {
      events: Array.from(this._events.values()).map((event) => event.key),
    });
  }

  public registerEvent(meta: TBackgroundEventMeta) {
    const event = this.createEvent(meta);
    this.registerEvents([event]);
    backgroundLogger.info('Registered Event', { event });
  }

  private createEvent(meta: TBackgroundEventMeta) {
    let key = meta?.key ?? uuidv4();
    if (this._events.has(key)) {
      const previousKey = key;
      key = `${key}_${uuidv4()}`;
      backgroundLogger.warn(
        `The Event name '${previousKey}' has already been used! The Event has been renamed to '${key}'.`
      );
    }
    return new BackgroundEvent(this._instance, key, meta);
  }

  private registerEvents(events: BackgroundEvent[]) {
    for (const event of events) {
      let type: string = event.meta.type;
      let typeCategory: string | null = null;
      const typeParts = type.split('.');
      if (typeParts.length === 2) {
        typeCategory = typeParts[0];
        type = typeParts[1];
      }

      // Register Background Events
      const onKeyword = event.meta.once ? 'once' : 'on';
      if (typeCategory === 'ui') {
        this._instance.figma.ui[onKeyword](type as any, (...args) => {
          this.onEvent(event, args);
        });
      } else {
        this._instance.figma[onKeyword](type as any, (...args) => {
          this.onEvent(event, args);
        });
      }
    }
  }

  private async onEvent(event: BackgroundEvent, args: any[]) {
    const { meta } = event;
    if (
      meta.shouldExecuteCallback == null ||
      // @ts-ignore (Expression produces a union type that is too complex to represent.)
      meta.shouldExecuteCallback(...args)
    ) {
      if (meta.type === 'ui.message') {
        const arg = args[0];
        if (arg != null && arg.key === event.key) {
          meta.callback(this._instance, arg?.args);
        }
      } else {
        // @ts-ignore (Expression produces a union type that is too complex to represent.)
        meta.callback(this._instance, ...args);
      }
    }
  }
}

export type TBackgroundsEventsHandlerConfig = {
  events?: TBackgroundEventMeta[];
};
