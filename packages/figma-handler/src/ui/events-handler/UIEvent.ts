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
  TFigmaUIMessageEvent extends TBaseFigmaMessageEvent,
  EventType extends keyof TUIEvents<TFigmaUIMessageEvent>
> = TUIEvents<TFigmaUIMessageEvent>[EventType][0] extends { key: infer TKey }
  ? TKey
  : string | undefined;

type TUIEventMetaBase<
  TFigmaUIMessageEvent extends TBaseFigmaMessageEvent,
  TFigmaBackgroundMessageEvent extends TBaseFigmaMessageEvent,
  EventType extends keyof TUIEvents<TFigmaUIMessageEvent>
> = {
  key: TKeyForEventType<TFigmaUIMessageEvent, EventType>;
  type: EventType;
  shouldExecuteCallback?: (
    ...args: TUIEvents<TFigmaUIMessageEvent>[EventType][0] extends {
      key: TKeyForEventType<TFigmaUIMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [
          args: {
            pluginId: string;
          } & TArgs
        ]
      : TUIEvents<TFigmaUIMessageEvent>[EventType]
  ) => boolean;
  callback: (
    // Note: To advanced for Typescript
    // instance: FigmaUIHandler<
    //   TFigmaUIMessageEvent,
    //   TFigmaBackgroundMessageEvent
    // >,
    instance: FigmaUIHandler,
    ...args: TUIEvents<TFigmaUIMessageEvent>[EventType][0] extends {
      key: TKeyForEventType<TFigmaUIMessageEvent, EventType>;
      args: infer TArgs;
    }
      ? [
          args: {
            pluginId: string;
          } & TArgs
        ]
      : TUIEvents<TFigmaUIMessageEvent>[EventType]
  ) => Promise<void>;
};

export type TUIEventMeta<
  TFigmaUIMessageEvent extends TBaseFigmaMessageEvent = TBaseFigmaMessageEvent,
  TFigmaBackgroundMessageEvent extends TBaseFigmaMessageEvent = TBaseFigmaMessageEvent
> =
  // This conditional type check ensures that the TUIMessageEvent type parameter
  // is a valid subtype of TBaseUIMessageEvent. It was necessary with type safety and
  // proper inference of the 'args' type in the TEventMetaBase type for the TUIMessageEvent type.
  TFigmaUIMessageEvent extends TBaseFigmaMessageEvent
    ? {
        [K in keyof TUIEvents<TBaseFigmaMessageEvent>]: TUIEventMetaBase<
          TFigmaUIMessageEvent,
          TFigmaBackgroundMessageEvent,
          K
        >;
      }[keyof TUIEvents<TFigmaUIMessageEvent>]
    : never;

export type TUIEvents<
  TFigmaUIMessageEvent extends TBaseFigmaMessageEvent,
  TWindowEventKeys extends keyof WindowEventMap = keyof WindowEventMap
> = {
  [K in TWindowEventKeys]: [event: WindowEventMap[K]];
} & {
  'figma.message': [event: TFigmaUIMessageEvent];
};
