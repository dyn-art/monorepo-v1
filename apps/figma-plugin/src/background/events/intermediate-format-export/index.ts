import { TBackgroundEventMeta } from '@pda/figma-handler';
import { TBackgroundFigmaMessageEvent, logger } from '../../../shared';
import { TBackgroundHandler } from '../../background-handler';
import { processNode } from './process-node';

export default {
  type: 'ui.message',
  key: 'intermediate-format-export-event',
  callback: async (instance: TBackgroundHandler, args) => {
    logger.info(`Called Event: 'intermediate-format-export-event'`, { args });

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
        await processNode(instance, node, args.config);
      }
    }
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent>;
