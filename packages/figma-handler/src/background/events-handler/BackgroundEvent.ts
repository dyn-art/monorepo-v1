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
  TFigmaMessageEvent extends TBaseFigmaMessageEvent,
  EventType extends keyof TBackgroundEvents<TFigmaMessageEvent>
> = TBackgroundEvents<TFigmaMessageEvent>[EventType][0] extends {
  key: infer TKey;
}
  ? TKey
  : string | undefined;

type TBackgroundEventMetaBase<
  TFigmaMessageEvent extends TBaseFigmaMessageEvent,
  EventType extends keyof TBackgroundEvents<TFigmaMessageEvent>
> = {
  key: TKeyForEventType<TFigmaMessageEvent, EventType>;
  type: EventType;
  once?: boolean;
  shouldExecuteCallback?: (
    ...args: TBackgroundEvents<TFigmaMessageEvent>[EventType][0] extends {
      key: TKeyForEventType<TFigmaMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [args: TArgs]
      : TBackgroundEvents<TFigmaMessageEvent>[EventType]
  ) => boolean;
  callback: (
    instance: FigmaBackgroundHandler,
    ...args: TBackgroundEvents<TFigmaMessageEvent>[EventType][0] extends {
      key: TKeyForEventType<TFigmaMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [args: TArgs]
      : TBackgroundEvents<TFigmaMessageEvent>[EventType]
  ) => Promise<void>;
};

export type TBackgroundEventMeta<
  TFigmaMessageEvent extends TBaseFigmaMessageEvent = TBaseFigmaMessageEvent
> =
  // This conditional type check ensures that the TUIMessageEvent type parameter
  // is a valid subtype of TBaseUIMessageEvent. It was necessary with type safety and
  // proper inference of the 'args' type in the TEventMetaBase type for the TUIMessageEvent type.
  TFigmaMessageEvent extends TBaseFigmaMessageEvent
    ? {
        [K in keyof TBackgroundEvents<TBaseFigmaMessageEvent>]: TBackgroundEventMetaBase<
          TFigmaMessageEvent,
          K
        >;
      }[keyof TBackgroundEvents<TFigmaMessageEvent>]
    : never;

// Note add to hardcode events as the Typescript compiler failed with more dynamic types based on @figma/..
// with the good old "Cannot read properties of undefined (reading 'flags')" error
export type TBackgroundEvents<
  TFigmaMessageEvent extends TBaseFigmaMessageEvent
> = {
  run: [event: RunEvent];
  drop: [event: DropEvent];
  documentchange: [event: DocumentChangeEvent];
  // UI Events
  'ui.message': [event: TFigmaMessageEvent];
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
