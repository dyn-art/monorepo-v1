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
      const eventsFileTree = await getFilesTree(eventsDir, fileSuffixes);
      eventFiles.push(...flattenFileTree(eventsFileTree));
    }
    const defaultEventsFileTree = await getFilesTree(
      EventsHandler.DEFAULT_EVENTS_DIR,
      ['.ts']
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
        event.name = `${event.name}_${'jeff'}`;
        console.warn(
          `The event name '${previousName}' has already been used. It has been renamed to '${event.name}'.`
        );
      }
      this._events.set(event.name, event);
    }

    // Register Events
    this.registerEvents(Array.from(this._events.values()));
  }

  private createEvent(fileName, meta) {
    const name = meta.name ?? fileName;
    return new Event(this._instance, name, meta);
  }

  private registerEvents(events: Event[]) {
    for (const event of events) {
      this._instance.client.on(event.meta.type, async (...args) => {
        // @ts-ignore
        event.meta.callback({ instance: this._instance, args });
      });
    }
  }
}

export type TEventsHandlerConfig = {
  eventsDir?: string;
  fileSuffixes?: string[];
};
