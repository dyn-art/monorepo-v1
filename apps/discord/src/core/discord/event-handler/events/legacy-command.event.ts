import { TEventMeta } from '../Event';

export default {
  type: 'messageCreate',
  name: 'legacy-command',
  callback: async ({ instance, args: [message] }) => {
    const { commandsHandler } = instance;
    if (commandsHandler == null) return;
    const { commandPrefix: prefix } = commandsHandler.config;

    // Check whether message starts with prefix
    if (prefix && !message.content.startsWith(prefix)) {
      return;
    }

    const args = message.content.split(/\s+/);

    // Get Command name
    let commandName = args.shift();
    if (commandName == null) {
      return;
    }

    // Format Command name
    if (commandName != null) {
      commandName = commandName.toLowerCase();
      if (prefix != null) {
        commandName = commandName.substring(prefix.length);
      }
    }

    // Get Command
    const command = commandsHandler.commands.get(commandName);
    if (command == null) {
      return;
    }
    const { reply, sendTyping } = command.meta;

    if (sendTyping) {
      message.channel.sendTyping();
    }

    // Run Command
    const response = await commandsHandler.runCommand(
      command,
      args,
      message,
      null
    );
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
