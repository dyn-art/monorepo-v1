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

// ============================================================================
// UI Event Types
// ============================================================================

export type TUIMessageEvent = {
  type: string;
  args: any;
};

export type TUIEvents = {
  message: [TUIMessageEvent];
};

// ============================================================================
// Event Types
// ============================================================================

export type TEvents = {
  run: [RunEvent];
  drop: [DropEvent];
  documentchange: [DocumentChangeEvent];
} & ArgFreeEvents &
  RemappedNestedEvents<'ui', TUIEvents>;

// ============================================================================
// Base Types
// ============================================================================

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

// ============================================================================
// Helper Types
// ============================================================================

type ArgFreeEvents = {
  [K in ArgFreeEventType]: [];
};

type RemappedNestedEvents<TName extends string, TNestedEvent> = {
  [K in Extract<
    keyof TNestedEvent,
    string
  > as `${TName}.${K}`]: TNestedEvent[K];
};
