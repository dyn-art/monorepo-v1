import {
  ApplicationCommandOption,
  Client,
  CommandInteraction,
  Guild,
  GuildMember,
  Message,
  TextChannel,
  User,
} from 'discord.js';
import DcClientHandler from '../DcClientHandler';
import CommandType from './CommandType';

export default class Command {
  private readonly _instance: DcClientHandler;
  public readonly name: string;
  public readonly meta: Omit<TCommandMeta, 'name'>;

  constructor(
    instance: DcClientHandler,
    name: string,
    meta: Omit<TCommandMeta, 'name'>
  ) {
    this._instance = instance;
    this.name = name;
    this.meta = meta;
  }
}

type TCommandMetaBase = {
  name?: string; // By default file name command is in
  description?: string;

  testOnly?: boolean;
  guildOnly?: boolean;
  adminsOnly?: boolean;

  onInit?: (data: TOnInitData) => Promise<void>;
  callback: (usage: TCommandUsage) => Promise<void>;
};

export type TCommandMetaSlash = {
  type: CommandType.SLASH;
  options?: ApplicationCommandOption[];
} & TCommandMetaBase;

export type TCommandMetaLegacy = {
  type: CommandType.LEGACY;
  delete?: boolean;
} & TCommandMetaBase;

export type TCommandMetaBoth = {
  type: CommandType.BOTH;
} & Omit<TCommandMetaLegacy, 'type'> &
  Omit<TCommandMetaSlash, 'type'>;

export type TCommandMeta =
  | TCommandMetaSlash
  | TCommandMetaLegacy
  | TCommandMetaBoth;

type TCommandUsage = {
  client: Client;
  instance: DcClientHandler;
  message?: Message;
  interaction?: CommandInteraction | null;
  args: string[];
  text: string;
  guild?: Guild;
  member?: GuildMember;
  user: User;
  channel?: TextChannel;
};

type TOnInitData = {
  client: Client;
  instance: DcClientHandler;
  command: Command;
};
