import { Client, IntentsBitField } from 'discord.js';
import path from 'path';
import { DCClientHandler } from './core';
import { discordConfig } from './environment';

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
  new DCClientHandler(client, {
    commands: {
      commandsDir: path.join(__dirname, 'commands'),
    },
  });
});

client.login(discordConfig.auth.token);
