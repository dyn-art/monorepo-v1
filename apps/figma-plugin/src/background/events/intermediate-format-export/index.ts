import { TBackgroundEventMeta } from '@dyn/figma-handler';
import { TBackgroundFigmaMessageEvent } from '../../../shared';
import { TBackgroundHandler } from '../../background-handler';
import { processNode } from './process-node';

export default {
  type: 'ui.message',
  key: 'intermediate-format-export',
  callback: async (instance: TBackgroundHandler, args) => {
    // Filter out unsupported nodes
    const supportedNodes = args.selectedElements
      .map((element) =>
        instance.figma.currentPage.findOne((node) => node.id === element.id)
      )
      .filter(
        (node) => node && ['FRAME', 'COMPONENT', 'INSTANCE'].includes(node.type)
      );

    // Process supported nodes
    for (const node of supportedNodes) {
      if (node != null) {
        await processNode(instance, node as FrameNode, args.options);
      }
    }
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent>;
