import { ClientEvents } from 'discord.js';
import DcClientHandler from '../DcClientHandler';

export default class Event {
  private readonly _instance: DcClientHandler;

  public name: string;
  public readonly meta: Omit<TEventMeta, 'name'>;

  constructor(
    instance: DcClientHandler,
    name: string,
    meta: Omit<TEventMeta, 'name'>
  ) {
    this._instance = instance;
    this.name = name;
    this.meta = meta;
  }
}

type TEventMetaBase<EventType extends keyof ClientEvents> = {
  name?: string; // By default file name command is specified in
  type: EventType;
  callback: (data: {
    instance: DcClientHandler;
    args: ClientEvents[EventType];
  }) => Promise<void>;
};

export type TEventMeta = {
  [K in keyof ClientEvents]: TEventMetaBase<K>;
}[keyof ClientEvents];
