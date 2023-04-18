import { TCommandMeta } from '../../core/discord/commands/Command';
import CommandType from '../../core/discord/commands/CommandType';

export default {
  type: CommandType.BOTH,
  callback: ({ message, args }) => {
    console.log(args);
    message?.reply('pong');
  },
} as TCommandMeta;
