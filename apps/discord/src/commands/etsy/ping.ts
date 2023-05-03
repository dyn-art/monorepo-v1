import { CommandType, TCommandMeta } from '@pda/discord-handler';

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
