import { TBackgroundEventMeta } from '@pda/figma-handler';
import { TBackgroundFigmaMessageEvent, logger } from '../../shared';

export default {
  type: 'ui.message',
  key: 'intermediate-format-export-event',
  callback: async (instance, event) => {
    logger.info(`Called Event: 'intermediate-format-export-event'`, { event });

    // TODO:
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent>;
