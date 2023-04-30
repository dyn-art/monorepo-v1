import { CommandType, TCommandMeta } from '@pda/discord-handler';

export default [
  {
    type: CommandType.LEGACY,
    argsOptions: { options: [{ type: 'boolean', name: 'evil', short: 'e' }] },
    callback: async ({ args }) => {
      console.log(args);

      return {
        // @ts-ignore
        content: args.get('evil').value ? 'Evil Pong' : 'Pong',
      };
    },
  },
  // {
  //   type: CommandType.SLASH,
  //   callback: async () => {
  //     return {
  //       content: 'Pong',
  //     };
  //   },
  // },
] as TCommandMeta[];
