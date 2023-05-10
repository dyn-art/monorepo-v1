import { TBackgroundEventMeta } from '@pda/figma-handler/dist/background';
import { TBackgroundFigmaMessageEvent } from '../../shared-types';
import { backgroundHandler } from '../background-handler';

export default {
  type: 'selectionchange',
  key: 'selection-change',
  callback: async (instance) => {
    const selection = figma.currentPage.selection;
    const frameSelected = selection.some((node) => node.type === 'FRAME');
    console.log('selection-change Event', { frameSelected });
    // TODO: make instance typesafe
    backgroundHandler.postMessage('on-select-event', {
      selectedElement: frameSelected,
    });
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent>;
