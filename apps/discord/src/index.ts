import { Client, IntentsBitField } from 'discord.js';
import { discordConfig } from './environment';

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
});

client.on('ready', () => {
  let handler = require('./command-handler');
  if (handler.default) handler = handler.default;

  handler(client);
});

client.login(discordConfig.auth.token);
