import { uiLogger } from '../../logger';
import { TUIEventMeta } from '../UIEvent';

export default {
  type: 'DOMContentLoaded',
  callback: async (instance, event) => {
    uiLogger.info(`Plugin started running!`);
  },
} as TUIEventMeta;
