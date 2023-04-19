import { TCommandMeta } from '../../core/discord/command-handler/Command';
import CommandType from '../../core/discord/command-handler/CommandType';

export default {
  type: CommandType.BOTH,
  callback: ({ message, args }) => {
    console.log(args);
    message?.reply('pong');
  },
} as TCommandMeta;
