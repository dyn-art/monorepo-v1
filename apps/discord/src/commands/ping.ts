import { CommandType, TCommandMeta } from '../core';

export default {
  type: CommandType.LEGACY,
  argsOptions: { options: [{ type: 'boolean', name: 'evil', short: 'e' }] },
  callback: async ({ args }) => {
    console.log(args);

    return {
      // @ts-ignore
      content: args.get('evil').value ? 'Evil Pong' : 'Pong',
    };
  },
} as TCommandMeta;
