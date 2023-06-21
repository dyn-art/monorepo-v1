import { TBaseFigmaMessageEvent } from '../../shared-types';
import FigmaBackgroundHandler from '../FigmaBackgroundHandler';

export default class BackgroundEvent<
  TMeta extends TBackgroundEventMeta = TBackgroundEventMeta
> {
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
  TFigmaBackgroundMessageEvent extends TBaseFigmaMessageEvent,
  EventType extends keyof TBackgroundEvents<TFigmaBackgroundMessageEvent>
> = TBackgroundEvents<TFigmaBackgroundMessageEvent>[EventType][0] extends {
  key: infer TKey;
}
  ? TKey
  : string | undefined;

type TBackgroundEventMetaBase<
  TFigmaBackgroundMessageEvent extends TBaseFigmaMessageEvent,
  TFigmaUIMessageEvent extends TBaseFigmaMessageEvent,
  EventType extends keyof TBackgroundEvents<TFigmaBackgroundMessageEvent>
> = {
  key: TKeyForEventType<TFigmaBackgroundMessageEvent, EventType>;
  type: EventType;
  once?: boolean;
  shouldExecuteCallback?: (
    ...args: TBackgroundEvents<TFigmaBackgroundMessageEvent>[EventType][0] extends {
      key: TKeyForEventType<TFigmaBackgroundMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [args: TArgs]
      : TBackgroundEvents<TFigmaBackgroundMessageEvent>[EventType]
  ) => boolean;
  callback: (
    // Note: To advanced for Typescript
    // instance: FigmaBackgroundHandler<
    //   TFigmaBackgroundMessageEvent,
    //   TFigmaUIMessageEvent
    // >,
    instance: FigmaBackgroundHandler,
    ...args: TBackgroundEvents<TFigmaBackgroundMessageEvent>[EventType][0] extends {
      key: TKeyForEventType<TFigmaBackgroundMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [args: TArgs]
      : TBackgroundEvents<TFigmaBackgroundMessageEvent>[EventType]
  ) => Promise<void>;
};

export type TBackgroundEventMeta<
  TFigmaBackgroundMessageEvent extends TBaseFigmaMessageEvent = TBaseFigmaMessageEvent,
  TFigmaUIMessageEvent extends TBaseFigmaMessageEvent = TBaseFigmaMessageEvent
> =
  // This conditional type check ensures that the TUIMessageEvent type parameter
  // is a valid subtype of TBaseUIMessageEvent. It was necessary with type safety and
  // proper inference of the 'args' type in the TEventMetaBase type for the TUIMessageEvent type.
  TFigmaBackgroundMessageEvent extends TBaseFigmaMessageEvent
    ? {
        [K in keyof TBackgroundEvents<TBaseFigmaMessageEvent>]: TBackgroundEventMetaBase<
          TFigmaBackgroundMessageEvent,
          TFigmaUIMessageEvent,
          K
        >;
      }[keyof TBackgroundEvents<TFigmaBackgroundMessageEvent>]
    : never;

// Note add to hardcode events as the Typescript compiler failed with more dynamic types based on @figma/..
// with the good old "Cannot read properties of undefined (reading 'flags')" error
export type TBackgroundEvents<
  TFigmaBackgroundMessageEvent extends TBaseFigmaMessageEvent
> = {
  run: [event: RunEvent];
  drop: [event: DropEvent];
  documentchange: [event: DocumentChangeEvent];
  // UI Events
  'ui.message': [event: TFigmaBackgroundMessageEvent];
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
