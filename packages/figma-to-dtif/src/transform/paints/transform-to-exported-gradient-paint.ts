import { TTransformNodeOptions } from '@/types';
import { TGradientPaintExported } from '@pda/types/dtif';
import { exportAndUploadNode, exportNode, sha256 } from '../../helpers';

export async function transformToExportedGradientPaint(
  paint: GradientPaint,
  node: SceneNode,
  options: TTransformNodeOptions = {}
): Promise<TGradientPaintExported> {
  const defaultFormat =
    paint.type === 'GRADIENT_DIAMOND' || paint.type === 'GRADIENT_ANGULAR'
      ? 'JPG' // Diamond and angular gradient can't be represented by SVG yet
      : 'SVG';
  const {
    gradientPaint: {
      exportOptions: {
        inline = true,
        uploadStaticData: uploadStaticDataCallback = undefined,
        format = defaultFormat,
      } = {},
    } = {},
    exportContainerNode,
  } = options;
  let hash: string;
  let content: Uint8Array | string | null;

  // Create temporary node that only contains the paint for export
  const paintNode = createPaintNode([paint], {
    containerNode: exportContainerNode,
    width: node.width,
    height: node.height,
  });

  // Export and upload node
  if (uploadStaticDataCallback != null && !inline) {
    const uploadResponse = await exportAndUploadNode(paintNode, {
      uploadStaticData: uploadStaticDataCallback,
      clone: false,
      exportSettings: { format },
    });
    hash = uploadResponse.key;
    content = uploadResponse.url ?? null;
  }

  // Export node and put it inline
  else {
    content = await exportNode(paintNode, { format });
    hash = sha256(content);
  }

  // Remove temporary paint node
  paintNode.remove();

  return {
    type: paint.type,
    isExported: true,
    format,
    hash,
    content: content ?? undefined,
    blendMode: paint.blendMode ?? 'PASS_THROUGH',
    opacity: paint.opacity ?? 1,
    isVisible: paint.visible ?? true,
  };
}

export function createPaintNode(
  paints: Paint[],
  config: { width: number; height: number; containerNode?: FrameNode }
): SceneNode {
  const { width, height, containerNode } = config;

  // Create paint node
  const paintNode = figma.createRectangle();
  paintNode.resize(width, height);
  paintNode.fills = paints;

  // Append paint node node to container node for context
  if (containerNode != null) {
    try {
      containerNode.appendChild(paintNode);
    } finally {
      paintNode.remove();
    }
  }

  return paintNode;
}
