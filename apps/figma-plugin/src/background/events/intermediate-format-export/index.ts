import { TBackgroundEventMeta } from '@pda/figma-handler';
import { TBackgroundFigmaMessageEvent, logger } from '../../../shared';
import { TBackgroundHandler } from '../../background-handler';
import { formatNode } from './helper/format-node';

export default {
  type: 'ui.message',
  key: 'intermediate-format-export-event',
  callback: async (instance: TBackgroundHandler, args) => {
    logger.info(`Called Event: 'intermediate-format-export-event'`, { args });

    for (const element of args.selectedElements) {
      // Find node by id
      const node = instance.figma.currentPage.findOne(
        (node) => node.id === element.id
      );
      if (
        node == null ||
        (node?.type !== 'FRAME' &&
          node.type !== 'COMPONENT' &&
          node.type !== 'INSTANCE')
      ) {
        continue;
      }

      // Export Node
      try {
        const toExportNode = await formatNode(node);
        logger.info('Exported Node', { exportedNode: toExportNode });
      } catch (e) {
        logger.error('Failed to export Node!', e);
      }
    }
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent>;
