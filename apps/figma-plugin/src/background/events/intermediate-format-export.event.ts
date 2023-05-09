import { TEventMeta } from '@pda/figma-handler';
import { TUIMessageEvent } from '../../types';

export default {
  type: 'ui.message',
  key: 'intermediate-format-export-event',
  // shouldExecuteCallback: (event) =>
  //   event.type === intermediateFormatExportEventKey,
  callback: async (instance, event) => {
    console.log('Test Event', { event });
  },
} as TEventMeta<TUIMessageEvent>;
