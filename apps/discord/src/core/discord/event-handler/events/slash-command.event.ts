import { CommandInteraction, InteractionType } from 'discord.js';
import { Command, TCommandMetaSlash, isSlash } from '../../command-handler';
import { TEventMeta } from '../Event';

export default {
  type: 'interactionCreate',
  shouldExecuteCallback: (interaction) =>
    interaction.type === InteractionType.ApplicationCommand,
  callback: async (instance, interaction: CommandInteraction) => {
    const { commandsHandler } = instance;
    if (commandsHandler == null) {
      return;
    }

    // Get arguments
    const args = interaction.options.data.map(({ value }) => {
      return String(value);
    });

    // Get Command
    const _command = commandsHandler.commands.get(interaction.commandName);
    if (_command == null || !isSlash(_command)) {
      return;
    }
    const command = _command as Command<TCommandMetaSlash>;
    const { sendTyping } = command.meta;

    if (sendTyping) {
      interaction.deferReply();
    }

    // Run Command
    const response = await commandsHandler.runCommand(
      command,
      args,
      interaction
    );
    if (response == null) {
      return;
    }

    // Send response
    if (sendTyping) {
      interaction.editReply(response).catch(() => {
        // do nothing
      });
    } else {
      interaction.reply(response as any).catch(() => {
        // do nothing
      });
    }
  },
} as TEventMeta;
