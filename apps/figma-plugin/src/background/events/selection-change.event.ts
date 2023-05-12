import { TBackgroundEventMeta } from '@pda/figma-handler';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../../shared-types';
import { TBackgroundHandler } from '../background-handler';
import { extractNodeProperties } from '../utils';

export default {
  type: 'selectionchange',
  key: 'selection-change',
  callback: async (instance: TBackgroundHandler) => {
    const selection = figma.currentPage.selection;
    const selectedFrames = selection.filter((node) => node.type === 'FRAME');

    console.log('selection-change', { instance, selection, selectedFrames });

    // Call UI events
    if (selectedFrames.length > 0) {
      instance.postMessage(
        'on-select-frame-event',
        selectedFrames.map((frame) =>
          extractNodeProperties(frame, ['x', 'y', 'name'])
        )
      );
    }
    instance.postMessage('on-select-node-event', {
      selected: [...selection],
    });
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent, TUIFigmaMessageEvent>;
