import {
  NodeException,
  PaintException,
  TResolveFontContent,
  TUploadStaticData,
  sha256,
  toComposition,
} from '@pda/figma-to-dtif';
import { TComposition } from '@pda/types/dtif';
import { extractErrorData } from '@pda/utils';
import { TIntermediateFormatExportEvent, logger } from '../../../shared';
import { TBackgroundHandler } from '../../background-handler';
import { googleService } from '../../core/api';
import { uploadDataToBucket } from '../../core/bucket';
import { stringToUint8Array } from '../../core/utils/json-to-uint8array';

export async function processNode(
  instance: TBackgroundHandler,
  node: FrameNode,
  options: TIntermediateFormatExportEvent['args']['options']
) {
  try {
    // Transform node to DTIF composition
    const toExportNode = await toComposition(node, {
      ...options,
      gradientPaint: {
        ...(options.gradientPaint ?? {}),
        exportOptions: {
          ...(options.gradientPaint?.exportOptions ?? {}),
          inline: options.gradientPaint?.exportOptions?.inline ?? false,
          uploadStaticData,
        },
      },
      imagePaint: {
        ...(options.imagePaint ?? {}),
        exportOptions: {
          ...(options.imagePaint?.exportOptions ?? {}),
          inline: options.imagePaint?.exportOptions?.inline ?? false,
          uploadStaticData,
        },
      },
      svg: {
        ...(options.svg ?? {}),
        exportOptions: {
          ...(options.svg?.exportOptions ?? {}),
          inline: options.svg?.exportOptions?.inline ?? false,
          uploadStaticData,
        },
      },
      font: {
        ...(options.font ?? {}),
        resolveFontContent,
        exportOptions: {
          ...(options.font?.exportOptions ?? {}),
          inline: options.font?.exportOptions?.inline ?? true,
          uploadStaticData,
        },
      },
    });

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

const uploadStaticData: TUploadStaticData = async (key, data, contentType) => {
  const finalKey = await uploadDataToBucket(
    key,
    data,
    contentType?.mimeType ?? 'application/octet-stream'
  );
  return { key: finalKey };
};

const resolveFontContent: TResolveFontContent = async (typeFace) => {
  const { family, fontWeight, style } = typeFace;
  const content = await googleService.downloadWebFontWOFF2File(family, {
    fontWeight,
    style,
  });
  if (content != null) {
    return new Uint8Array(content);
  } else {
    return null;
  }
};

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
  const { message } = extractErrorData(error);
  instance.postMessage('intermediate-format-export-result', {
    type: 'error',
    message,
  });
  const figmaMessage = `Error exporting node '${node.name}': ${message}`;
  figma.notify(figmaMessage, {
    error: true,
  });
  logger.error(figmaMessage, { error });
  if (error instanceof NodeException) {
    figma.currentPage.selection = [error.node];
  } else if (error instanceof PaintException && error.node != null) {
    figma.currentPage.selection = [error.node];
  }
}
