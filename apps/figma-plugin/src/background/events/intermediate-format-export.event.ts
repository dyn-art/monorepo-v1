import { TBackgroundEventMeta } from '@pda/figma-handler/dist/background';
import { TBackgroundFigmaMessageEvent } from '../../shared-types';

export default {
  type: 'ui.message',
  key: 'intermediate-format-export-event',
  // shouldExecuteCallback: (event) =>
  //   event.type === intermediateFormatExportEventKey,
  callback: async (instance, event) => {
    console.log('intermediate-format-export Event', { event });
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent>;
