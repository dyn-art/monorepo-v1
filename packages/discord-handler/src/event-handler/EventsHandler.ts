import { uuidv4 } from '@pda/utils';
import path from 'path';
import DcClientHandler from '../DcClientHandler';
import { TFile, flattenFileTree, getFilesTree } from '../utils/get-file-tree';
import Event, { TEventMeta } from './Event';

export default class EventsHandler {
  private readonly _instance: DcClientHandler;
  private readonly _config: TEventsHandlerConfig;

  private _events: Map<string, Event> = new Map();

  private static DEFAULT_EVENTS_DIR = path.join(__dirname, 'events');

  constructor(instance: DcClientHandler, config: TEventsHandlerConfig) {
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

      // Initialize Event
      const event = this.createEvent(eventFile.name, meta);

      // Add Event to events
      if (this._events.has(event.name)) {
        const previousName = event.name;
        event.name = `${event.name}_${uuidv4()}`;
        console.warn(
          `The event name '${previousName}' has already been used. It has been renamed to '${event.name}'.`
        );
      }
      this._events.set(event.name, event);
    }

    // Register Events
    this.registerEvents(Array.from(this._events.values()));

    console.info('Registered Events', {
      events: Array.from(this._events.values()).map((event) => event.name),
    });
  }

  private createEvent(fileName: string, meta: TEventMeta) {
    const name = meta?.name ?? fileName;
    // @ts-ignore (Expression produces a union type that is too complex to represent.)
    return new Event(this._instance, name, meta);
  }

  private registerEvents(events: Event[]) {
    for (const event of events) {
      this._instance.client.on(event.meta.type, async (...args: any[]) => {
        if (
          event.meta.shouldExecuteCallback == null ||
          // @ts-ignore (Expression produces a union type that is too complex to represent.)
          event.meta.shouldExecuteCallback(...args)
        ) {
          // @ts-ignore (Expression produces a union type that is too complex to represent.)
          event.meta.callback(this._instance, ...args);
        }
      });
    }
  }
}

export type TEventsHandlerConfig = {
  eventsDir?: string;
  fileSuffixes?: string[];
};
