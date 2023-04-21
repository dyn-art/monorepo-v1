import {
  ApplicationCommandOption,
  AutocompleteInteraction,
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

export default class Command<TMeta extends TCommandMeta = TCommandMeta> {
  private readonly _instance: DcClientHandler;
  public readonly name: string;
  public readonly meta: Omit<TMeta, 'name'>;

  constructor(
    instance: DcClientHandler,
    name: string,
    meta: Omit<TMeta, 'name'>
  ) {
    this._instance = instance;
    this.name = name;
    this.meta = meta;
  }
}

export function isLegacy(
  command: Command
): command is Command<TCommandMetaLegacy> {
  return command.meta.type === CommandType.LEGACY;
}

export function isSlash(
  command: Command
): command is Command<TCommandMetaSlash> {
  return command.meta.type === CommandType.SLASH;
}

export function isBoth(command: Command): command is Command<TCommandMetaBoth> {
  return command.meta.type === CommandType.BOTH;
}

type TCommandMetaBase = {
  name?: string; // By default file name command is specified in
  description?: string;

  testOnly?: boolean;
  guildOnly?: boolean;
  adminsOnly?: boolean;

  sendTyping?: boolean;

  onInit?: (data: TOnInitData) => Promise<void>;
};

export type TCommandMetaSlash = {
  type: CommandType.SLASH;
  options?: ApplicationCommandOption[];
  autocomplete?: (
    command: Command,
    argument: string,
    interaction: AutocompleteInteraction
  ) => Promise<string[]>;
  callback: (usage: TCommandUsageSlash) => TCommandMetaSlashCallbackReturnType;
} & TCommandMetaBase;

export type TCommandMetaSlashCallbackReturnType = Promise<
  | Parameters<CommandInteraction['reply']>[0]
  | Parameters<CommandInteraction['editReply']>[0]
>;

export type TCommandMetaLegacy = {
  type: CommandType.LEGACY;
  delete?: boolean;
  reply?: boolean;
  callback: (usage: TCommandUsageSlash) => TCommandMetaLegacyCallbackReturnType;
} & TCommandMetaBase;

export type TCommandMetaLegacyCallbackReturnType = Promise<
  Parameters<Message['reply']>[0] | Parameters<Message['channel']['send']>[0]
>;

export type TCommandMetaBoth = {
  type: CommandType.BOTH;
} & Omit<TCommandMetaLegacy, 'type'> &
  Omit<TCommandMetaSlash, 'type'>;

export type TCommandMeta =
  | TCommandMetaSlash
  | TCommandMetaLegacy
  | TCommandMetaBoth;

type TCommandUsageBase = {
  client: Client;
  instance: DcClientHandler;
  args: string[];
  text: string;
  guild?: Guild;
  member?: GuildMember;
  user: User;
  channel?: TextChannel;
};

type TCommandUsageSlash = {
  interaction: CommandInteraction;
} & TCommandUsageBase;

type TCommandUsageLegacy = {
  message: Message;
} & TCommandUsageBase;

type TOnInitData = {
  client: Client;
  instance: DcClientHandler;
  command: Command;
};
