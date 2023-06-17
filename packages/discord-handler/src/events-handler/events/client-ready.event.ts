import { Events } from 'discord.js';
import { logger } from '../../logger';
import { TEventMeta } from '../Event';

export default {
  type: Events.ClientReady,
  once: true,
  callback: async (instance, client) => {
    logger.info(`Ready! Logged in as '${client.user.tag}'.`);
  },
} as TEventMeta;
