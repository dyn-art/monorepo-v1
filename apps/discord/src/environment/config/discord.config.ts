const token = process.env.DCISCORD_TOKEN ?? 'not-set';
const clientId = process.env.DISCORD_CLIENT_ID ?? 'not-set';

export default {
  auth: {
    token,
    clientId,
  },
  guildId: '976752614228250635',
};
