// ============================================================================
// Type Methods
// ============================================================================

import {
  APIInteractionGuildMember,
  Client,
  Guild,
  GuildMember,
  TextBasedChannel,
  User,
} from 'discord.js';
import DcClientHandler from '../../DcClientHandler';
import {
  TComponentButtonMeta,
  TComponentModalMeta,
} from '../../components-handler';
import CommandType from '../CommandType';
import BaseCommand from './BaseCommand';
import { TCommandMetaLegacy, TCommandUsageLegacy } from './LegacyCommand';
import { TCommandMetaSlash, TCommandUsageSlash } from './SlashCommand';

// ============================================================================
// Type Methods
// ============================================================================

export function isCommandMeta(value: any): value is TCommandMeta {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const validTypes = [CommandType.SLASH, CommandType.LEGACY];
  const hasValidType = value.type != null && validTypes.includes(value.type);
  const hasCallback = typeof value.callback === 'function';

  return hasValidType && hasCallback;
}

// ============================================================================
// Base Types
// ============================================================================

export type TCommandMetaBase<TCommand extends BaseCommand = BaseCommand> = {
  key?: string; // By default file name command is specified in
  description?: string;

  testOnly?: boolean;
  guildOnly?: boolean;
  adminsOnly?: boolean;

  sendTyping?: boolean;

  onInit?: (data: TOnInitData<TCommand>) => Promise<void>;
};

export type TCommandMeta = TCommandMetaSlash | TCommandMetaLegacy;

export type TCommandUsageBase = {
  client: Client;
  instance: DcClientHandler;
  args: string[] | Map<string, TCommandArg>;
  text: string;
  guild: Guild | null;
  member: GuildMember | APIInteractionGuildMember | null;
  user: User;
  channel: TextBasedChannel | null;
  registerModal?: (meta: TComponentModalMeta) => void;
  registerButton?: (meta: TComponentButtonMeta) => void;
};

export type TCommandArg = {
  value: string | number | boolean | string[] | number[] | boolean[] | null;
  subArgs?: Map<string, TCommandArg>;
};

export type TCommandUsage = TCommandUsageSlash | TCommandUsageLegacy;

export type TOnInitData<TCommand extends BaseCommand = BaseCommand> = {
  client: Client;
  instance: DcClientHandler;
  command: TCommand;
};
