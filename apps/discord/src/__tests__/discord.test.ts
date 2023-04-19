import { Client, IntentsBitField } from 'discord.js';
import path from 'path';
import DcClientHandler from '../core/discord/DcClientHandler';

describe('discord tests', () => {
  it('should work', async () => {
    const client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
      ],
    });
    const commandsDir = path.join(__dirname, '../commands');
    const dcClientHandler = new DcClientHandler(client, {
      commands: {
        commandsDir: commandsDir,
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(dcClientHandler).not.toBeNull();
  });
});
