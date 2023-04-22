import {
  AutocompleteInteraction,
  Interaction,
  InteractionType,
} from 'discord.js';
import { Command, TCommandMetaSlash, isSlash } from '../../command-handler';
import { TEventMeta } from '../Event';

export default {
  type: 'interactionCreate',
  shouldExecuteCallback: (interaction: Interaction) =>
    interaction.type === InteractionType.ApplicationCommandAutocomplete,
  callback: async (instance, interaction: AutocompleteInteraction) => {
    const { commandsHandler } = instance;
    if (commandsHandler == null) {
      return;
    }

    // Get Command associated with the interaction
    const { commands } = commandsHandler;
    const _command = commands.get(interaction.commandName);
    if (_command == null || !isSlash(_command)) {
      return;
    }
    const command = _command as Command<TCommandMetaSlash>;

    // Check whether to autocomplete
    const { autocomplete } = command.meta;
    if (autocomplete == null) {
      return;
    }

    // Get possible choices
    const focusedOption = interaction.options.getFocused(true);
    const choices = await autocomplete(
      command,
      focusedOption.name,
      interaction
    );

    // Filter the choices based on the input value
    const filtered = choices
      .filter((choice: string) =>
        choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
      )
      .slice(0, 25);

    // Send response
    await interaction.respond(
      filtered.map((choice: string) => ({
        name: choice,
        value: choice,
      }))
    );
  },
} as TEventMeta;
