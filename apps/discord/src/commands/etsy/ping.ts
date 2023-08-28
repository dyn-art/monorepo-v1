import { CommandType, TCommandMeta } from '@dyn/discord-handler';

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
