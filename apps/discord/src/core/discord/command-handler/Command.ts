import {
  APIInteractionGuildMember,
  ApplicationCommandOption,
  AutocompleteInteraction,
  Client,
  CommandInteraction,
  Guild,
  GuildMember,
  Message,
  TextBasedChannel,
  User,
} from 'discord.js';
import DcClientHandler from '../DcClientHandler';
import CommandType from './CommandType';

export default class Command<TMeta extends TCommandMeta = TCommandMeta> {
  public readonly instance: DcClientHandler;
  public readonly name: string;
  public readonly meta: Omit<TMeta, 'name'>;

  constructor(
    instance: DcClientHandler,
    name: string,
    meta: Omit<TMeta, 'name'>
  ) {
    this.instance = instance;
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
  callback: (
    usage: TCommandUsageLegacy
  ) => TCommandMetaLegacyCallbackReturnType;
} & TCommandMetaBase;

export type TCommandMetaLegacyCallbackReturnType = Promise<
  Parameters<Message['reply']>[0] | Parameters<Message['channel']['send']>[0]
>;

export type TCommandMeta = TCommandMetaSlash | TCommandMetaLegacy;

export type TCommandUsageBase = {
  client: Client;
  instance: DcClientHandler;
  args: string[];
  text: string;
  guild: Guild | null;
  member: GuildMember | APIInteractionGuildMember | null;
  user: User;
  channel: TextBasedChannel | null;
};

export type TCommandUsageSlash = {
  interaction: CommandInteraction;
} & TCommandUsageBase;

export type TCommandUsageLegacy = {
  message: Message;
} & TCommandUsageBase;

export type TCommandUsage = TCommandUsageSlash | TCommandUsageLegacy;

type TOnInitData = {
  client: Client;
  instance: DcClientHandler;
  command: Command;
};
