import { TBackgroundEventMeta } from '@dyn/figma-handler';
import {
  EUIPageRoute,
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../../shared';
import { TBackgroundHandler } from '../background-handler';
import { ACTIVE_UI_ROUTE } from '../core/ui';
import { SELECTED_NODE_IDS } from '../core/ui/nodes';
import { extractNodeProperties, getObjectPropertyKeys } from '../core/utils';

export default {
  type: 'selectionchange',
  key: 'selection-change',
  callback: async (instance: TBackgroundHandler) => {
    const selection = figma.currentPage.selection;
    const selectedFrames = selection.filter(
      (node) => node.type === 'FRAME' || node.type === 'COMPONENT'
    );

    // Update state
    SELECTED_NODE_IDS.set(selection.map((node) => node.id));

    // Post on select frame UI event
    if (ACTIVE_UI_ROUTE.value === EUIPageRoute.DTIF) {
      if (selectedFrames.length > 0) {
        instance.postMessage('on-select-frame', {
          selected: selectedFrames.map((frame) =>
            extractNodeProperties(frame, ['name', 'id'])
          ),
        });
      } else {
        instance.postMessage('on-select-frame', { selected: [] });
      }
    }

    // Post on select node id UI event
    instance.postMessage('on-select-node-id', {
      selected: selection.map((node) =>
        extractNodeProperties(node, ['name', 'id'])
      ),
    });

    // Post on select node properties UI event
    if (ACTIVE_UI_ROUTE.value === EUIPageRoute.NODE_INSPECTOR) {
      instance.postMessage('on-select-node-properties', {
        selected: selection.map((node) =>
          extractNodeProperties(node, getObjectPropertyKeys(node) as any)
        ) as SceneNode[],
      });
    }
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent, TUIFigmaMessageEvent>;
