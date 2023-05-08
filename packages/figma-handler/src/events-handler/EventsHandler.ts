import { TFile, flattenFileTree, getFilesTree, uuidv4 } from '@pda/utils';
import path from 'path';
import FigmaClientHandler from '../FigmaClientHandler';
import { logger } from '../logger';
import Event, { TEventMeta } from './Event';

export default class EventsHandler {
  private readonly _instance: FigmaClientHandler;
  private readonly _config: TEventsHandlerConfig;

  private _events: Map<string, Event> = new Map();

  private static DEFAULT_EVENTS_DIR = path.join(__dirname, 'events');

  constructor(instance: FigmaClientHandler, config: TEventsHandlerConfig) {
    this._instance = instance;
    this._config = config;

    this.initializeEventsFromDirectory(
      this._config.eventsDir,
      this._config.fileSuffixes
    );
  }

  private async initializeEventsFromDirectory(
    eventsDir?: string,
    fileSuffixes: string[] = []
  ) {
    const eventFiles: TFile[] = [];
    if (eventsDir) {
      const eventsFileTree = await getFilesTree(eventsDir, {
        suffixes: fileSuffixes,
      });
      eventFiles.push(...flattenFileTree(eventsFileTree));
    }
    const defaultEventsFileTree = await getFilesTree(
      EventsHandler.DEFAULT_EVENTS_DIR
    );
    eventFiles.push(...flattenFileTree(defaultEventsFileTree));

    // Create Events
    for (const eventFile of eventFiles) {
      const meta = eventFile.content as TEventMeta;
      const event = this.createEvent(eventFile.name, meta);
      this._events.set(event.key, event);
    }

    // Register Events
    this.registerEvents(Array.from(this._events.values()));

    logger.info('Registered Events', {
      events: Array.from(this._events.values()).map((event) => event.key),
    });
  }

  private createEvent(fileName: string, meta: TEventMeta) {
    let key = meta?.key ?? fileName;
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
        typeCategory = typeCategory[0];
        type = typeCategory[1];
      }

      // Register UI Events
      if (typeCategory === 'ui') {
        if (event.meta.once) {
          this._instance.figma.ui.once(type, (...args) => {
            this.onEvent(event, args);
          });
        } else {
          this._instance.figma.ui.on(type, (...args) => {
            this.onEvent(event, args);
          });
        }
        // Register General Events
      } else {
        if (event.meta.once) {
          this._instance.figma.once(type, (...args) => {
            this.onEvent(event, args);
          });
        } else {
          this._instance.figma.on(type, (...args) => {
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
  eventsDir?: string;
  fileSuffixes?: string[];
};
