import { logger } from '../../../logger';
import { TEventMeta } from '../Event';

export default {
  type: 'run',
  callback: async (instance, event) => {
    logger.info(`Plugin started running!`);
  },
} as TEventMeta;
