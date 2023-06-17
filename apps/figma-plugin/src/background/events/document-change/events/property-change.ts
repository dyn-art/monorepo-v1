import { isRemovedNode } from '@pda/figma-to-dtif';
import { EUIPageRoute } from '../../../../shared';
import { TBackgroundHandler } from '../../../background-handler';
import { ACTIVE_UI_ROUTE, SELECTED_NODE_IDS } from '../../../core/ui';
import {
  extractNodeProperties,
  getObjectPropertyKeys,
} from '../../../core/utils';

export async function onPropertyChange(
  instance: TBackgroundHandler,
  event: PropertyChange
) {
  if (ACTIVE_UI_ROUTE.value === EUIPageRoute.NODE_INSPECTOR) {
    const node = event.node;

    // Post on change selected node properties UI event
    if (SELECTED_NODE_IDS.value.includes(node.id) && !isRemovedNode(node)) {
      instance.postMessage('on-change-selected-node-properties', {
        changed: extractNodeProperties(
          node,
          getObjectPropertyKeys(node) as any
        ) as SceneNode,
      });
    }
  }
}
