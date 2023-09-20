import { CommandType, TCommandMeta } from '@dyn/discord-handler';
import { ApplicationCommandOptionType } from 'discord.js';

export default {
  type: CommandType.SLASH,
  description: 'Creates an Etsy listing.',
  sendTyping: true,
  argsOptions: [
    {
      name: 'name',
      description: 'Enter the name',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'description',
      description: 'Enter the description',
      type: ApplicationCommandOptionType.String,
      required: true,
      subArgsOptions: {
        options: [{ name: 'format', type: 'boolean', short: 'f' }],
      },
    },
    {
      name: 'image',
      description: 'Enter the image',
      type: ApplicationCommandOptionType.Attachment,
      required: true,
    },
  ],
  callback: async ({ interaction, args }) => {
    console.log(args);

    return {
      content: 'Jeff',
    };
  },
} as TCommandMeta;
