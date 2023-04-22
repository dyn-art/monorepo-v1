import { Command, TCommandMetaLegacy, isLegacy } from '../../command-handler';
import { TEventMeta } from '../Event';

export default {
  type: 'messageCreate',
  name: 'legacy-command',
  shouldExecuteCallback: (message) => !message.author.bot,
  callback: async (instance, message) => {
    const { commandsHandler } = instance;
    if (commandsHandler == null) {
      return;
    }

    // Check whether message starts with prefix
    const { commandPrefix: prefix } = commandsHandler.config;
    if (prefix && !message.content.startsWith(prefix)) {
      return;
    }

    const args = message.content.split(/\s+/);

    // Get & format Command name
    let commandName = args.shift();
    if (commandName == null) {
      return;
    }
    commandName = commandName.toLowerCase();
    if (prefix != null) {
      commandName = commandName.substring(prefix.length);
    }

    // Get Command
    const _command = commandsHandler.commands.get(commandName);
    if (_command == null || !isLegacy(_command)) {
      return;
    }
    const command = _command as Command<TCommandMetaLegacy>;
    const { reply, sendTyping } = command.meta;

    if (sendTyping) {
      message.channel.sendTyping();
    }

    // Run Command
    const response = await commandsHandler.runCommand(command, args, message);
    if (response == null) {
      return;
    }

    // Send response
    if (reply) {
      message.reply(response).catch(() => {
        // do nothing
      });
    } else {
      message.channel.send(response).catch(() => {
        // do nothing
      });
    }
  },
} as TEventMeta;
