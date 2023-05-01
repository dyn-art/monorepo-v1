import { CommandType, TCommandMeta } from '@pda/discord-handler';
import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

export default [
  {
    type: CommandType.LEGACY,
    argsOptions: { options: [{ type: 'boolean', name: 'cat', short: 'c' }] },
    callback: async ({ args }) => {
      console.log(args);

      return {
        // @ts-ignore
        content: args.get('evil').value ? 'Cat Pong' : 'Pong',
      };
    },
  },
  {
    type: CommandType.SLASH,
    callback: async ({ interaction }) => {
      // TODO:

      const modal = new ModalBuilder()
        .setCustomId('test')
        .setTitle('My Test Modal');

      const title = new TextInputBuilder()
        .setCustomId('title')
        .setLabel('Title')
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      const actionRow =
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          title
        );

      modal.addComponents(actionRow);

      await interaction.showModal(modal);

      return {
        content: 'Pong',
      };
    },
  },
] as TCommandMeta[];
