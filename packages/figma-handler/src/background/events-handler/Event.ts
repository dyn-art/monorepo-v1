import FigmaBackgroundHandler from '../FigmaBackgroundHandler';

export default class Event<TMeta extends TEventMeta = TEventMeta> {
  public readonly instance: FigmaBackgroundHandler;
  public readonly key: string;
  public readonly meta: Omit<TMeta, 'key'>;

  constructor(
    instance: FigmaBackgroundHandler,
    key: string,
    meta: Omit<TMeta, 'key'>
  ) {
    this.instance = instance;
    this.key = key;
    this.meta = meta;
  }
}

type TKeyForEventType<
  TUIMessageEvent extends TBaseUIMessageEvent,
  EventType extends keyof TEvents<TUIMessageEvent>
> = TEvents<TUIMessageEvent>[EventType][0] extends { type: infer TType }
  ? TType
  : string | undefined;

type TArgsForKey<TEvent, TKey> = TEvent extends {
  type: TKey;
  args: infer TArgs;
}
  ? TArgs
  : unknown;

type TEventMetaBase<
  TUIMessageEvent extends TBaseUIMessageEvent,
  EventType extends keyof TEvents<TUIMessageEvent>
> = {
  key: TKeyForEventType<TUIMessageEvent, EventType>;
  type: EventType;
  once?: boolean;
  shouldExecuteCallback?: (
    ...args: TEvents<TUIMessageEvent>[EventType][0] extends {
      type: TKeyForEventType<TUIMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [args: TArgs]
      : TEvents<TUIMessageEvent>[EventType]
  ) => boolean;
  callback: (
    instance: FigmaBackgroundHandler,
    ...args: TEvents<TUIMessageEvent>[EventType][0] extends {
      type: TKeyForEventType<TUIMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [args: TArgs]
      : TEvents<TUIMessageEvent>[EventType]
  ) => Promise<void>;
};

// Note TShared (now more simplified TUIMessageEvent) isn't reached in from the Event class as the Typescript Compiler (tsc)
// didn't manage to compile that without the good old "Cannot read properties of undefined (reading 'flags')" error
export type TEventMeta<
  TUIMessageEvent extends TBaseUIMessageEvent = TBaseUIMessageEvent
> = {
  [K in keyof TEvents<TBaseUIMessageEvent>]: TEventMetaBase<TUIMessageEvent, K>;
}[keyof TEvents<TUIMessageEvent>];

// Note add to hardcode events as the Typescript compiler failed with more dynamic types based on @figma/..
// with the good old "Cannot read properties of undefined (reading 'flags')" error
export type TEvents<TUIMessageEvent extends TBaseUIMessageEvent> = {
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

export type TBaseUIMessageEvent = {
  type: string;
  args: any;
};

// TESTS -------------------------------

const test = {
  type: 'ui.message',
  key: 'test1',
  // shouldExecuteCallback: (event) =>
  //   event.type === intermediateFormatExportEventKey,
  callback: async (instance, event) => {
    console.log('Test Event', { event });
  },
} as TEventMeta<TIntermediateFormatExportEvent | TTestEvent>;

type TIntermediateFormatExportEvent = {
  type: 'test1';
  args: { test1: any };
};

type TTestEvent = {
  type: 'test2';
  args: { test2: any };
};
