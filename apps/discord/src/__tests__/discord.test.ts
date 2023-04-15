import { Client, IntentsBitField } from 'discord.js';
import DcClientHandler from '../core/discord/DcClientHandler';

describe('discord tests', () => {
  it('should work', () => {
    const client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
      ],
    });
    const dcClientHandler = new DcClientHandler({ client });

    expect(dcClientHandler).not.toBeNull();
  });
});
