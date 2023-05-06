const token = process.env.DISCORD_TOKEN ?? 'not-set';
const applicationId = process.env.DISCORD_APPLICATION_ID ?? 'not-set';

export default {
  auth: {
    token,
  },
  applicationId,
  guildId: '976752614228250635',
};
