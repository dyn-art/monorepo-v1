import { TEventMeta } from '@pda/figma-handler';

export default {
  type: 'ui.message',
  key: 'test',
  shouldExecuteCallback: (event) => event.type === 'test',
  callback: async (instance, event) => {
    console.log('Test Event', { event });
  },
} as TEventMeta;
