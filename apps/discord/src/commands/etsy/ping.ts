import { TCommandMeta } from '../../core';
import CommandType from '../../core/discord/command-handler/CommandType';

export default {
  type: CommandType.LEGACY,
  // name: 'jeff',
  reply: true,
  sendTyping: true,
  callback: async () => {
    return {
      content: 'Pong',
    };
  },
} as TCommandMeta;
