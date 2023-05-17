import { TTransform } from '@pda/shared-types';
import { logger } from '../../../../shared';
import { TBackgroundHandler } from '../../../background-handler';
import { formatNode } from './format-node';
import { stringToUint8Array } from './json-to-uint8array';
import { sha256 } from './sha256';
import { uploadDataToBucket } from './upload-data-to-bucket';

export async function processNode(
  instance: TBackgroundHandler,
  node: SceneNode
) {
  try {
    // Format the node for export
    let toExportNode = await formatNode(node);
    if (toExportNode == null) {
      throw Error(`Failed to format node '${node.name}'!`);
    }

    // Reset top level position node properties
    toExportNode = {
      ...toExportNode,
      x: 0,
      y: 0,
      rotation: 0,
      transform: toExportNode.transform.map((row) => [
        row[0],
        row[1],
        0,
      ]) as TTransform,
    };

    // Upload the node as JSON string to bucket
    const json = JSON.stringify(toExportNode);
    const key = sha256(json);
    await uploadDataToBucket(key, stringToUint8Array(json), 'application/json');

    // Post success message and notify the user
    instance.postMessage('intermediate-format-export-result-event', {
      type: 'success',
      content: json,
    });
    figma.notify(`Node '${node.name}' was exported successfully.`);
    logger.success(`Node '${node.name}' was exported successfully.`, {
      exportedNode: toExportNode,
      key,
    });
  } catch (e: any) {
    // Handle errors and notify the user
    const message = e.message ?? JSON.stringify(e);
    instance.postMessage('intermediate-format-export-result-event', {
      type: 'error',
      message,
    });
    figma.notify(`Error exporting node: ${message}`, { error: true });
    logger.error('Failed to export Node!', e);
  }
}
