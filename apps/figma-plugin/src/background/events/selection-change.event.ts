import { TBackgroundEventMeta } from '@pda/figma-handler';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
  logger,
} from '../../shared';
import { TBackgroundHandler } from '../background-handler';
import { extractNodeProperties } from '../core';

export default {
  type: 'selectionchange',
  key: 'selection-change',
  callback: async (instance: TBackgroundHandler) => {
    const selection = figma.currentPage.selection;
    const selectedFrames = selection.filter(
      (node) => node.type === 'FRAME' || node.type === 'COMPONENT'
    );

    logger.info(`Called Event: 'selectionchange'`, { selection });

    // Call UI events
    if (selectedFrames.length > 0) {
      instance.postMessage('on-select-frame-event', {
        selected: selectedFrames.map((frame) =>
          extractNodeProperties(frame, ['name', 'id'])
        ),
      });
    } else {
      instance.postMessage('on-select-frame-event', { selected: [] });
    }
    instance.postMessage('on-select-node-event', {
      selected: selection.map((selection) =>
        extractNodeProperties(selection, ['name', 'id'])
      ),
    });
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent, TUIFigmaMessageEvent>;
