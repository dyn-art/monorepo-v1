import { CommandType, TCommandMeta } from '../core';

export default {
  type: CommandType.SLASH,
  callback: async () => {
    return {
      content: 'Pong',
    };
  },
} as TCommandMeta;
