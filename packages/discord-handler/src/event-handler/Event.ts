import { ClientEvents } from 'discord.js';
import DcClientHandler from '../DcClientHandler';

export default class Event<TMeta extends TEventMeta = TEventMeta> {
  public readonly instance: DcClientHandler;
  public readonly key: string;
  public readonly meta: Omit<TMeta, 'name'>;

  constructor(
    instance: DcClientHandler,
    key: string,
    meta: Omit<TMeta, 'name'>
  ) {
    this.instance = instance;
    this.key = key;
    this.meta = meta;
  }
}

type TEventMetaBase<EventType extends keyof ClientEvents> = {
  key?: string; // By default file name command is specified in
  type: EventType;
  shouldExecuteCallback?: (...args: ClientEvents[EventType]) => boolean;
  callback: (
    instance: DcClientHandler,
    ...args: ClientEvents[EventType]
  ) => Promise<void>;
};

export type TEventMeta = {
  [K in keyof ClientEvents]: TEventMetaBase<K>;
}[keyof ClientEvents];
