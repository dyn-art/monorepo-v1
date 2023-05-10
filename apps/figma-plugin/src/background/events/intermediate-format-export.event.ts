import { backgroundHandler } from '../background-handler';

backgroundHandler.registerEvent({
  type: 'ui.message',
  key: 'intermediate-format-export-event',
  // shouldExecuteCallback: (event) =>
  //   event.type === intermediateFormatExportEventKey,
  callback: async (instance, event) => {
    console.log('intermediate-format-export Event', { event });
  },
});
