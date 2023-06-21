import { backgroundLogger } from '../../logger';
import { TBackgroundEventMeta } from '../BackgroundEvent';

export default {
  type: 'run',
  callback: async (instance, event) => {
    backgroundLogger.info(`Plugin started running!`);
  },
} as TBackgroundEventMeta;
