import { TBackgroundEventMeta } from '@pda/figma-handler';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../../shared-types';

export default {
  type: 'selectionchange',
  key: 'selection-change',
  callback: async (instance) => {
    const selection = figma.currentPage.selection;
    const frameSelected = selection.some((node) => node.type === 'FRAME');
    console.log('selection-change Event', { frameSelected });
    // TODO: make instance typesafe
    instance.postMessage('on-select-event', {
      selectedElement: frameSelected,
    });
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent, TUIFigmaMessageEvent>;
