import { backgroundHandler } from '../background-handler';

backgroundHandler.registerEvent({
  type: 'selectionchange',
  key: 'selection-change',
  callback: async (instance) => {
    const selection = figma.currentPage.selection;
    const frameSelected = selection.some((node) => node.type === 'FRAME');
    console.log('selection-change Event', { frameSelected });
    backgroundHandler.postMessage('on-select-event', {
      selectedElement: frameSelected,
    });
  },
});
