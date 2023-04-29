import {
  Command,
  TCommandArg,
  TCommandMetaLegacy,
  isLegacy,
} from '../../command-handler';
import { parseArgs } from '../../utils/parse-args';
import { TEventMeta } from '../Event';

export default {
  type: 'messageCreate',
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

    // Get & format command name
    let commandName = args.shift();
    if (commandName == null) {
      return;
    }
    commandName = commandName.toLowerCase();
    if (prefix != null) {
      commandName = commandName.substring(prefix.length);
    }

    // Get command
    const _command = commandsHandler.commands.get(commandName);
    if (_command == null || !isLegacy(_command)) {
      return;
    }
    const command = _command as Command<TCommandMetaLegacy>;
    const { reply, sendTyping, argsOptions } = command.meta;

    // Get arguments
    let parsedArgs: string[] | Map<string, TCommandArg> = args;
    if (argsOptions != null) {
      parsedArgs = new Map<string, TCommandArg>();
      const _parsedArgs = new Map<string, TCommandArg>();
      parseArgs(args, argsOptions).forEach((value, key) =>
        _parsedArgs.set(key, { value })
      );
      parsedArgs = _parsedArgs;
    }

    if (sendTyping) {
      message.channel.sendTyping();
    }

    // Run command
    const response = await commandsHandler.runCommand(
      command,
      parsedArgs,
      message.content,
      message
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
