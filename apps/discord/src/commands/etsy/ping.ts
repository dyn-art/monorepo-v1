import { TCommandMeta } from '../../core/discord/command-handler/Command';
import CommandType from '../../core/discord/command-handler/CommandType';

export default {
  type: CommandType.LEGACY,
  callback: async ({ message, args }) => {
    console.log(args);
    return {
      content: 'Pong',
    };
  },
} as TCommandMeta;
