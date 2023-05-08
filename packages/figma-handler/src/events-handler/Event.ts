import FigmaClientHandler from '../FigmaClientHandler';

export default class Event<TMeta extends TEventMeta = TEventMeta> {
  public readonly instance: FigmaClientHandler;
  public readonly key: string;
  public readonly meta: Omit<TMeta, 'key'>;

  constructor(
    instance: FigmaClientHandler,
    key: string,
    meta: Omit<TMeta, 'key'>
  ) {
    this.instance = instance;
    this.key = key;
    this.meta = meta;
  }
}

type TUIEventMetaBase<EventType extends keyof TEvents> = {
  key?: string; // By default file name command is specified in
  type: EventType;
  once?: boolean;
  shouldExecuteCallback?: (...args: TEvents[EventType]) => boolean;
  callback: (
    instance: FigmaClientHandler,
    ...args: TEvents[EventType]
  ) => Promise<void>;
};

export type TEventMeta = {
  [K in keyof TEvents]: TUIEventMetaBase<K>;
}[keyof TEvents];

export type TUIMessageEvent = {
  type: string;
  args: any;
};

// Note add to hardcode events as the Typescript compiler failed with more dynamic types based on @figma/..
export type TEvents = {
  run: [event: RunEvent];
  drop: [event: DropEvent];
  documentchange: [event: DocumentChangeEvent];
  // UI Events
  'ui.message': [event: TUIMessageEvent];
  // ArgFree Events (ArgFreeEventType)
  selectionchange: [];
  currentpagechange: [];
  close: [];
  timerstart: [];
  timerstop: [];
  timerpause: [];
  timerresume: [];
  timeradjust: [];
  timerdone: [];
};
