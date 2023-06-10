import formatNodeToDTIF, {
  NodeException,
  UploadStaticDataException,
  sha256,
} from '@pda/figma-to-dtif';
import { TIntermediateFormatExportEvent, logger } from '../../../shared';
import { TBackgroundHandler } from '../../background-handler';
import { uploadDataToBucket } from '../../core/bucket';
import { stringToUint8Array } from '../../core/utils/json-to-uint8array';

export async function processNode(
  instance: TBackgroundHandler,
  node: SceneNode,
  config: TIntermediateFormatExportEvent['args']['config']
) {
  try {
    // Format the node for export
    const toExportNode = await formatNodeToDTIF(node, {
      ...config,
      uploadStaticData: async (key, data, contentType) => {
        if (contentType == null) {
          throw new UploadStaticDataException(
            `Can't upload data for '${key}' as no content type could be resolved!`,
            node
          );
        }
        return uploadDataToBucket(key, data, contentType?.mimeType);
      },
    });

    // Upload the node as JSON string to bucket
    const json = JSON.stringify(toExportNode);
    const key = sha256(json);
    await uploadDataToBucket(key, stringToUint8Array(json), 'application/json');

    // Post success message and notify the user
    instance.postMessage('intermediate-format-export-result', {
      type: 'success',
      content: toExportNode,
    });
    const successMessage = `Successfully exported node '${node.name}' :)`;
    figma.notify(successMessage);
    logger.success(successMessage, {
      exportedNode: toExportNode,
      key,
    });
  } catch (error) {
    let errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    instance.postMessage('intermediate-format-export-result', {
      type: 'error',
      message: errorMessage,
    });
    errorMessage = `Error exporting node '${node.name}': ${errorMessage}`;
    figma.notify(errorMessage, {
      error: true,
    });
    logger.error(errorMessage, { error });
    if (error instanceof NodeException) {
      figma.currentPage.selection = [error.node];
    }
  }
}
