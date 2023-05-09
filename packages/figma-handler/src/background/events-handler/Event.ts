import { TBaseUIMessageEvent } from '../../types';
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
> = TEvents<TUIMessageEvent>[EventType][0] extends { key: infer TKey }
  ? TKey
  : string | undefined;

type TEventMetaBase<
  TUIMessageEvent extends TBaseUIMessageEvent,
  EventType extends keyof TEvents<TUIMessageEvent>
> = {
  key: TKeyForEventType<TUIMessageEvent, EventType>;
  type: EventType;
  once?: boolean;
  shouldExecuteCallback?: (
    ...args: TEvents<TUIMessageEvent>[EventType][0] extends {
      key: TKeyForEventType<TUIMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [args: TArgs]
      : TEvents<TUIMessageEvent>[EventType]
  ) => boolean;
  callback: (
    instance: FigmaBackgroundHandler,
    ...args: TEvents<TUIMessageEvent>[EventType][0] extends {
      key: TKeyForEventType<TUIMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [args: TArgs]
      : TEvents<TUIMessageEvent>[EventType]
  ) => Promise<void>;
};

export type TEventMeta<
  TUIMessageEvent extends TBaseUIMessageEvent = TBaseUIMessageEvent
> =
  // This conditional type check ensures that the TUIMessageEvent type parameter
  // is a valid subtype of TBaseUIMessageEvent. It was necessary with type safety and
  // proper inference of the 'args' type in the TEventMetaBase type for the TUIMessageEvent type.
  TUIMessageEvent extends TBaseUIMessageEvent
    ? {
        [K in keyof TEvents<TBaseUIMessageEvent>]: TEventMetaBase<
          TUIMessageEvent,
          K
        >;
      }[keyof TEvents<TUIMessageEvent>]
    : never;

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
