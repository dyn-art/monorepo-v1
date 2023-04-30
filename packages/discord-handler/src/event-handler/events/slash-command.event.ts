import { CommandInteraction, InteractionType } from 'discord.js';
import { TCommandArg } from '../../command-handler';
import { parseArgs } from '../../utils/parse-args';
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
    const args = interaction.options.data.map(({ value, name }) => ({
      value: value ?? null,
      name,
    }));

    // Get command
    const command = commandsHandler.slashCommands.get(interaction.commandName);
    if (command == null) {
      return;
    }
    const { sendTyping, argsOptions } = command.meta;

    // Parse arguments
    const parsedArgs: Map<string, TCommandArg> = new Map();
    args.forEach((arg) => {
      const argOptions = argsOptions?.find(
        (option) => option.name === arg.name
      );
      let parsedSubArgs: Map<string, TCommandArg> | undefined = undefined;
      if (argOptions?.subArgsOptions != null) {
        const _parsedSubArgs = new Map<string, TCommandArg>();
        parseArgs(
          typeof arg.value === 'string' ? arg.value.split(' ') : [],
          argOptions.subArgsOptions
        ).forEach((value, key) => {
          _parsedSubArgs.set(key, { value });
        });
        parsedSubArgs = _parsedSubArgs;
      }
      parsedArgs.set(arg.name, { value: arg.value, subArgs: parsedSubArgs });
    });

    if (sendTyping) {
      await interaction.deferReply(
        typeof sendTyping === 'object' ? sendTyping : {}
      );
    }

    // Run Command
    const response = await commandsHandler.runCommand(
      command,
      parsedArgs,
      args.join(' '),
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
