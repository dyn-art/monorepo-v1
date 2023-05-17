import { TBackgroundEventMeta } from '@pda/figma-handler';
import { TBackgroundFigmaMessageEvent, logger } from '../../../shared';
import { TBackgroundHandler } from '../../background-handler';
import { formatNode } from './helper/format-node';
import { stringToUint8Array } from './helper/json-to-uint8array';
import { sha256 } from './helper/sha256';
import { uploadDataToBucket } from './helper/upload-data-to-bucket';

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
        const json = JSON.stringify(toExportNode);
        const key = sha256(json);
        await uploadDataToBucket(
          key,
          stringToUint8Array(json),
          'application/json'
        );
        instance.postMessage('intermediate-format-export-result-event', {
          type: 'success',
          content: json,
        });
        figma.notify(`Successfully exported node '${node.name}'.`);
        logger.success(`Successfully exported node '${node.name}'.`, {
          exportedNode: toExportNode,
          key,
        });
      } catch (e: any) {
        const message = e.message ?? JSON.stringify(e);
        instance.postMessage('intermediate-format-export-result-event', {
          type: 'error',
          message,
        });
        figma.notify(message, { error: true });
        logger.error('Failed to export Node!', e);
      }
    }
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent>;
