import { Message } from 'discord.js';
import { TComponentLegacyCommandModalMeta } from '../../components-handler';
import { TParseArgsConfig } from '../../utils/parse-args';
import CommandType from '../CommandType';
import BaseCommand from './BaseCommand';
import { TCommandMetaBase, TCommandUsageBase } from './types';

export default class LegacyCommand extends BaseCommand<TCommandMetaLegacy> {}

// ============================================================================
// Type Methods
// ============================================================================

export function isLegacyCommandMeta(value: any): value is TCommandMetaLegacy {
  return value.type === CommandType.LEGACY;
}

// ============================================================================
// Base Types
// ============================================================================

export type TCommandMetaLegacy = {
  type: CommandType.LEGACY;
  argsOptions?: TParseArgsConfig;
  delete?: boolean;
  reply?: boolean;
  callback: (
    usage: TCommandUsageLegacy
  ) => Promise<TCommandLegacyCallbackReturnType>;
} & TCommandMetaBase<LegacyCommand>;

export type TCommandLegacyCallbackReturnType =
  | Parameters<Message['reply']>[0]
  | Parameters<Message['channel']['send']>[0]
  | TComponentLegacyCommandModalMeta
  | void;

export type TCommandUsageLegacy = {
  message: Message;
} & TCommandUsageBase;
