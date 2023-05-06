import {
  ApplicationCommandOption,
  AutocompleteInteraction,
  CommandInteraction,
  InteractionDeferReplyOptions,
} from 'discord.js';
import { TComponentModalMeta } from '../../components-handler';
import { TParseArgsConfig } from '../../utils/parse-args';
import CommandType from '../CommandType';
import BaseCommand from './BaseCommand';
import { TCommandMetaBase, TCommandUsageBase } from './types';

export default class SlashCommand extends BaseCommand<TCommandMetaSlash> {}

// ============================================================================
// Type Methods
// ============================================================================

export function isSlashCommandMeta(value: any): value is TCommandMetaSlash {
  return value.type === CommandType.SLASH;
}

// ============================================================================
// Base Types
// ============================================================================

export type TCommandMetaSlash = {
  type: CommandType.SLASH;
  argsOptions?: (ApplicationCommandOption & {
    subArgsOptions: TParseArgsConfig;
  })[];
  sendTyping?: InteractionDeferReplyOptions | boolean;
  autocomplete?: (
    command: SlashCommand,
    argument: string,
    interaction: AutocompleteInteraction
  ) => Promise<string[]>;
  callback: (
    usage: TCommandUsageSlash
  ) => Promise<TCommandSlashCallbackReturnType>;
} & Omit<TCommandMetaBase<SlashCommand>, 'sendTyping'>;

export type TCommandSlashCallbackReturnType =
  | Parameters<CommandInteraction['reply']>[0]
  | Parameters<CommandInteraction['editReply']>[0]
  | TComponentModalMeta
  | void;

export type TCommandUsageSlash = {
  interaction: CommandInteraction;
} & TCommandUsageBase;
