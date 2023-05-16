import { TBackgroundEventMeta } from '@pda/figma-handler';
import { TBackgroundFigmaMessageEvent, logger } from '../../shared';
import {
  TFrameNode,
  TGroupNode,
  TNode,
  TPaint,
  TRectangleNode,
  TSVGNode,
  TTextNode,
} from '../../shared/types/intermediate-format';
import { TBackgroundHandler } from '../background-handler';
import { coreConfig } from '../environment';

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
      const toExportNode = await formatNode(node);

      logger.info('Exported Node', { exportedNode: toExportNode });
    }
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent>;

async function formatNode(node: SceneNode): Promise<TNode | null> {
  if (node == null) {
    return null;
  }

  switch (node.type) {
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE':
      return formatFrameNode(node);
    case 'GROUP':
      return formatGroupNode(node);
    case 'TEXT':
      return formatTextNode(node);
    case 'RECTANGLE':
      return formatRectangleNode(node);
    case 'LINE':
    case 'ELLIPSE':
    case 'POLYGON':
    case 'STAR':
    case 'VECTOR':
    case 'BOOLEAN_OPERATION':
      return formatMiscellaneousNodes(node);
    default:
      // do nothing

      return null;
  }
}

async function formatFrameNode(
  node: FrameNode | ComponentNode | InstanceNode
): Promise<TFrameNode> {
  return {
    type: 'FRAME',
    clipsContent: node.clipsContent,
    // BaseNode mixin
    id: node.id,
    name: node.name,
    // Children mixin
    children: await Promise.all(node.children.map(formatNode)),
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: node.relativeTransform,
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects,
    // RectangleCorner mixin
    bottomLeftRadius: node.bottomLeftRadius,
    bottomRightRadius: node.bottomRightRadius,
    topLeftRadius: node.topLeftRadius,
    topRightRadius: node.topRightRadius,
    // Fills mixin
    fills: await handleFills(node.fills),
  } as TFrameNode;
}

async function formatGroupNode(node: GroupNode): Promise<TGroupNode> {
  return {
    type: 'GROUP',
    // BaseNode mixin
    id: node.id,
    name: node.name,
    // Children mixin
    children: (await Promise.all(node.children.map(formatNode))).filter(
      (node) => node != null
    ) as TNode[],
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: node.relativeTransform,
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects,
  };
}

async function formatTextNode(node: TextNode): Promise<TTextNode> {
  return {
    type: 'TEXT',
    textAlignHorizontal: node.textAlignHorizontal,
    textAlignVertical: node.textAlignVertical,
    fontSize: node.fontSize,
    fontName: node.fontName,
    fontWeight: node.fontWeight,
    letterSpacing: node.letterSpacing,
    lineHeight: node.lineHeight,
    characters: node.characters,
    // BasNode mixin
    id: node.id,
    name: node.name,
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: node.relativeTransform,
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects,
  } as TTextNode;
}

async function formatRectangleNode(
  node: RectangleNode
): Promise<TRectangleNode> {
  return {
    type: 'RECTANGLE',
    // BasNode mixin
    id: node.id,
    name: node.name,
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: node.relativeTransform,
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects,
    // RectangleCorner mixin
    bottomLeftRadius: node.bottomLeftRadius,
    bottomRightRadius: node.bottomRightRadius,
    topLeftRadius: node.topLeftRadius,
    topRightRadius: node.topRightRadius,
    // Fills mixin
    fills: await handleFills(node.fills),
  };
}

async function formatMiscellaneousNodes(
  node:
    | LineNode
    | EllipseNode
    | PolygonNode
    | StarNode
    | VectorNode
    | BooleanOperationNode
): Promise<TSVGNode> {
  // Convert the node type to SVG
  const svgString = await node.exportAsync({ format: 'SVG_STRING' });

  // Get the image hash
  const svgHash = svgString;

  return {
    type: 'SVG',
    svgHash: svgHash,
    // BaseNode mixin
    id: node.id,
    name: node.name,
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: node.relativeTransform,
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects,
  };
}

async function handleFills(inputFills: Paint[] | unknown): Promise<TPaint[]> {
  if (!Array.isArray(inputFills)) return [];
  const fills: TPaint[] = [];

  for (const fill of inputFills) {
    switch (fill.type) {
      case 'GRADIENT_ANGULAR':
      case 'GRADIENT_DIAMOND':
      case 'GRADIENT_LINEAR':
      case 'GRADIENT_RADIAL':
        fills.push(fill);
        continue;
      case 'IMAGE':
        fills.push(await handleImageFill(fill));
        continue;
      case 'SOLID':
        fills.push(fill);
        continue;
      default:
      // do nothing
    }
  }

  return fills;
}

async function handleImageFill(fill: ImagePaint) {
  let imageHash = fill.imageHash;
  if (imageHash == null) return fill;

  // Get pre signed upload url
  const response = await fetch(
    `${coreConfig.baseUrl}/media/pre-signed-upload-url?contentType=image/png&key=${imageHash}`,
    {
      method: 'GET',
      headers: {
        'X-CORS-API-KEY': coreConfig.corsApiKey,
      },
    }
  );
  const { uploadUrl, key } = await response.json();

  // Upload file to S3-Bucket
  if (typeof uploadUrl === 'string' && typeof key === 'string') {
    const imageData = await figma.getImageByHash(imageHash)?.getBytesAsync();
    const imageType = getImageType(imageData);
    if (imageData != null && imageType != null) {
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': imageType.mimeType,
        },
        body: imageData,
      });
      imageHash = key;
    }
  }

  return { ...fill, imageHash };
}

function getImageType(
  imageData?: Uint8Array
): { name: string; mimeType: string; ending: string } | null {
  if (imageData == null || imageData.length < 4) {
    return null;
  }

  // Try to detect image type based on first bytes
  const firstBytes = imageData.slice(0, 4);
  if (
    firstBytes[0] === 0x89 &&
    firstBytes[1] === 0x50 &&
    firstBytes[2] === 0x4e &&
    firstBytes[3] === 0x47
  ) {
    return {
      name: 'png',
      mimeType: 'image/png',
      ending: '.png',
    };
  }
  if (firstBytes[0] === 0xff && firstBytes[1] === 0xd8) {
    return {
      name: 'jpeg',
      mimeType: 'image/jpeg',
      ending: '.jpeg',
    };
  }
  if (
    firstBytes[0] === 0x47 &&
    firstBytes[1] === 0x49 &&
    firstBytes[2] === 0x46 &&
    firstBytes[3] === 0x38
  ) {
    return {
      name: 'gif',
      mimeType: 'image/gif',
      ending: '.gif',
    };
  }
  if (firstBytes[0] === 0x42 && firstBytes[1] === 0x4d) {
    return {
      name: 'bmp',
      mimeType: 'image/bmp',
      ending: '.bmp',
    };
  }
  if (
    firstBytes[0] === 0x49 &&
    firstBytes[1] === 0x49 &&
    firstBytes[2] === 0x2a &&
    firstBytes[3] === 0x00
  ) {
    return {
      name: 'tiff',
      mimeType: 'image/tiff',
      ending: '.tiff',
    };
  }

  // Try to detect image type based on text content
  const firstChars = new TextDecoder().decode(imageData.slice(0, 50)).trim();
  if (firstChars.startsWith('<svg')) {
    return {
      name: 'svg',
      mimeType: 'image/svg+xml',
      ending: '.svg',
    };
  }

  return null;
}
