import { CommandType, ComponentType, TCommandMeta } from '@pda/discord-handler';
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
    callback: async ({ args, client }) => {
      const botTestingChannel = client.channels.cache.get(
        '1099266406828220498'
      );
      if (botTestingChannel != null && botTestingChannel.isTextBased()) {
        botTestingChannel.send('/imagine prompt:a boat');
      }

      return {
        // @ts-ignore
        content: args.get('cat')?.value ? 'Pong to cat' : 'Pong',
      };
    },
  },
  {
    type: CommandType.SLASH,
    callback: async () => {
      const modal = new ModalBuilder()
        .setCustomId('ping')
        .setTitle('My Ping Modal');

      const title = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Your Name')
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      const actionRow =
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          title
        );

      modal.addComponents(actionRow);

      return {
        type: ComponentType.MODAL,
        modal,
        // removeAfterSubmit: true,
        callback: async ({ interaction }) => {
          await interaction.reply({
            content: `Pong to '${interaction.fields.getTextInputValue(
              'name'
            )}'`,
          });
        },
      };
    },
  },
] as TCommandMeta[];
