import { CommandType, TCommandMeta } from '../core';

export default {
  type: CommandType.SLASH,
  callback: async ({ interaction, args }) => {
    console.log(args);

    // interaction.reply({
    //   content: 'Pong',
    // });

    return {
      content: 'Pong',
    };
  },
} as TCommandMeta;
