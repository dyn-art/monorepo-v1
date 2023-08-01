import {
  NodeException,
  TUploadStaticData,
  sha256,
  toComposition,
} from '@pda/figma-to-dtif';
import { TComposition } from '@pda/types/dtif';
import { TIntermediateFormatExportEvent, logger } from '../../../shared';
import { TBackgroundHandler } from '../../background-handler';
import { uploadDataToBucket } from '../../core/bucket';
import { stringToUint8Array } from '../../core/utils/json-to-uint8array';

export async function processNode(
  instance: TBackgroundHandler,
  node: FrameNode,
  options: TIntermediateFormatExportEvent['args']['options']
) {
  const uploadStaticData: TUploadStaticData = async (
    key,
    data,
    contentType
  ) => {
    const finalKey = await uploadDataToBucket(
      key,
      data,
      contentType?.mimeType ?? 'application/octet-stream'
    );
    return { key: finalKey };
  };

  try {
    // Format the node for export
    const toExportNode = await toComposition(node, {
      ...options,
      gradientFill: {
        ...(options.gradientFill ?? {}),
        exportOptions: {
          ...(options.gradientFill?.exportOptions ?? {}),
          inline: options.gradientFill?.exportOptions?.inline ?? true,
          uploadStaticData,
        },
      },
      imageFill: {
        ...(options.imageFill ?? {}),
        exportOptions: {
          ...(options.imageFill?.exportOptions ?? {}),
          inline: options.imageFill?.exportOptions?.inline ?? true,
          uploadStaticData,
        },
      },
      svg: {
        ...(options.svg ?? {}),
        exportOptions: {
          ...(options.svg?.exportOptions ?? {}),
          inline: options.svg?.exportOptions?.inline ?? true,
          uploadStaticData,
        },
      },
      font: {
        ...(options.font ?? {}),
        exportOptions: {
          ...(options.font?.exportOptions ?? {}),
          inline: options.font?.exportOptions?.inline ?? true,
          uploadStaticData,
        },
      },
    });

    if (toExportNode == null) {
      throw new NodeException('To export node is null!', node);
    }

    // Upload the node as JSON string to bucket
    const json = JSON.stringify(toExportNode);
    const key = options.nameAsBucketId ? node.name : sha256(json);
    await uploadDataToBucket(key, stringToUint8Array(json), 'application/json');

    // Post success message and notify the user
    handleSuccess(instance, node, toExportNode, key);
  } catch (error) {
    handleError(error, instance, node);
  }
}

function handleSuccess(
  instance: TBackgroundHandler,
  node: SceneNode,
  toExportNode: TComposition,
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
