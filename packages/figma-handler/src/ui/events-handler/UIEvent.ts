import { TBaseFigmaMessageEvent } from '../../shared-types';
import FigmaUIHandler from '../FigmaUIHandler';

export default class UIEvent<TMeta extends TUIEventMeta = TUIEventMeta> {
  public readonly instance: FigmaUIHandler;
  public readonly key: string;
  public readonly meta: Omit<TMeta, 'key'>;

  constructor(instance: FigmaUIHandler, key: string, meta: Omit<TMeta, 'key'>) {
    this.instance = instance;
    this.key = key;
    this.meta = meta;
  }
}

type TKeyForEventType<
  TFigmaMessageEvent extends TBaseFigmaMessageEvent,
  EventType extends keyof TUIEvents<TFigmaMessageEvent>
> = TUIEvents<TFigmaMessageEvent>[EventType][0] extends { key: infer TKey }
  ? TKey
  : string | undefined;

type TUIEventMetaBase<
  TFigmaMessageEvent extends TBaseFigmaMessageEvent,
  EventType extends keyof TUIEvents<TFigmaMessageEvent>
> = {
  key: TKeyForEventType<TFigmaMessageEvent, EventType>;
  type: EventType;
  shouldExecuteCallback?: (
    ...args: TUIEvents<TFigmaMessageEvent>[EventType][0] extends {
      key: TKeyForEventType<TFigmaMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [args: TArgs]
      : TUIEvents<TFigmaMessageEvent>[EventType]
  ) => boolean;
  callback: (
    instance: FigmaUIHandler,
    ...args: TUIEvents<TFigmaMessageEvent>[EventType][0] extends {
      key: TKeyForEventType<TFigmaMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [args: TArgs]
      : TUIEvents<TFigmaMessageEvent>[EventType]
  ) => Promise<void>;
};

export type TUIEventMeta<
  TFigmaMessageEvent extends TBaseFigmaMessageEvent = TBaseFigmaMessageEvent
> =
  // This conditional type check ensures that the TUIMessageEvent type parameter
  // is a valid subtype of TBaseUIMessageEvent. It was necessary with type safety and
  // proper inference of the 'args' type in the TEventMetaBase type for the TUIMessageEvent type.
  TFigmaMessageEvent extends TBaseFigmaMessageEvent
    ? {
        [K in keyof TUIEvents<TBaseFigmaMessageEvent>]: TUIEventMetaBase<
          TFigmaMessageEvent,
          K
        >;
      }[keyof TUIEvents<TFigmaMessageEvent>]
    : never;

export type TUIEvents<
  TFigmaMessageEvent extends TBaseFigmaMessageEvent,
  TWindowEventKeys extends keyof WindowEventMap = keyof WindowEventMap
> = {
  [K in TWindowEventKeys]: [event: WindowEventMap[K]];
} & {
  'figma.message': [event: TFigmaMessageEvent];
};
