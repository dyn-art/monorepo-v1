import formatFrameToScene, {
  NodeException,
  TUploadStaticData,
  UploadStaticDataException,
  sha256,
} from '@pda/figma-to-dtif';
import { TNode } from '@pda/types/dtif';
import { TIntermediateFormatExportEvent, logger } from '../../../shared';
import { TBackgroundHandler } from '../../background-handler';
import { uploadDataToBucket } from '../../core/bucket';
import { stringToUint8Array } from '../../core/utils/json-to-uint8array';

export async function processNode(
  instance: TBackgroundHandler,
  node: FrameNode | InstanceNode | ComponentNode,
  options: TIntermediateFormatExportEvent['args']['options']
) {
  try {
    const uploadStaticData: TUploadStaticData = async (
      key,
      data,
      contentType
    ) => {
      if (contentType == null) {
        throw new UploadStaticDataException(
          `Can't upload data for '${key}' as no content type could be resolved!`,
          node
        );
      }
      return uploadDataToBucket(key, data, contentType?.mimeType);
    };
    // Format the node for export
    const toExportNode = await formatFrameToScene(node, {
      ...options,
      gradientFill: {
        ...(options.gradientFill ?? {}),
        exportOptions: {
          uploadStaticData,
          ...(options.gradientFill?.exportOptions ?? {}),
        },
      },
      imageFill: {
        uploadStaticData,
        ...(options.imageFill ?? {}),
      },
      svg: {
        ...(options.svg ?? {}),
        exportOptions: {
          uploadStaticData,
          ...(options.svg?.exportOptions ?? {}),
        },
      },
    });

    if (toExportNode == null) {
      throw Error('To export node is null!');
    }

    // Upload the node as JSON string to bucket
    const json = JSON.stringify(toExportNode);
    const key = sha256(json);
    await uploadDataToBucket(key, stringToUint8Array(json), 'application/json');

    // Post success message and notify the user
    handleSuccess(instance, node, toExportNode.root, key);
  } catch (error) {
    handleError(error, instance, node);
  }
}

function handleSuccess(
  instance: TBackgroundHandler,
  node: SceneNode,
  toExportNode: TNode,
  key: string
) {
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
}

function handleError(
  error: unknown,
  instance: TBackgroundHandler,
  node: SceneNode
) {
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
