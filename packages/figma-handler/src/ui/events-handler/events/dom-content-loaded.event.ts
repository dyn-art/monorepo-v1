import { backgroundLogger } from '../../../background/logger';
import { TUIEventMeta } from '../UIEvent';

export default {
  type: 'DOMContentLoaded',
  callback: async (instance, event) => {
    backgroundLogger.info(`Plugin started running!`);
  },
} as TUIEventMeta;
