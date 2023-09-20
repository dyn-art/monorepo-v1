import {
  convert2DMatrixTo3DMatrix,
  exportAndUploadNode,
  exportNodeCloned,
  sha256,
} from '@/helpers';
import { TSVGCompatibleNode, TTransformNodeOptions } from '@/types';
import { svgParser } from '@dyn/svgson';
import { TSVGNode } from '@dyn/types/dtif';

export async function transformToSVGNode(
  node: TSVGCompatibleNode,
  options: TTransformNodeOptions
): Promise<TSVGNode> {
  const { svg: { inline = true } = {}, exportContainerNode } = options;
  let svgNode: TSVGNode;

  // Export node as inline SVG
  if (inline) {
    svgNode = await transformToInlineSVGNode(node, {
      containerNode: exportContainerNode,
    });
  }

  // Export node as byte array
  else {
    svgNode = await transformToExportedSVGNode(node, options);
  }

  return svgNode;
}

async function transformToInlineSVGNode(
  node: TSVGCompatibleNode,
  options: { containerNode: TTransformNodeOptions['exportContainerNode'] }
): Promise<TSVGNode> {
  const { containerNode } = options;

  // Export node as inline SVG string
  const svgString = await exportNodeCloned(node, {
    format: 'SVG_STRING',
    containerNode,
  });
  const svgObject = svgParser.parse(svgString);

  return {
    type: 'SVG',
    isExported: false,
    children: svgObject.children,
    // BaseNode mixin
    name: node.name,
    // SceneNode mixin
    isLocked: node.locked,
    isVisible: node.visible,
    // Layout mixin
    height: node.height,
    width: node.width,
    relativeTransform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
  };
}

async function transformToExportedSVGNode(
  node: TSVGCompatibleNode,
  options: TTransformNodeOptions
): Promise<TSVGNode> {
  const {
    gradientPaint: {
      exportOptions: {
        inline = true,
        uploadStaticData: uploadStaticDataCallback = undefined,
        format = 'SVG',
      } = {},
    } = {},
    exportContainerNode,
  } = options;
  let hash: string;
  let content: Uint8Array | string | null;

  // Export and upload node
  if (uploadStaticDataCallback != null && !inline) {
    const uploadResponse = await exportAndUploadNode(node, {
      uploadStaticData: uploadStaticDataCallback,
      clone:
        exportContainerNode != null
          ? { containerNode: exportContainerNode }
          : true,
      exportSettings: { format },
    });
    hash = uploadResponse.key;
    content = uploadResponse.url ?? null;
  }

  // Export node and put it inline
  else {
    content = await exportNodeCloned(node, { format });
    hash = sha256(content);
  }

  return {
    type: 'SVG',
    isExported: true,
    format,
    hash,
    content: content ?? undefined,
    // Base node mixin
    name: node.name,
    // Scene node mixin
    isLocked: node.locked,
    isVisible: node.visible,
    // Layout mixin
    height: node.height,
    width: node.width,
    relativeTransform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
  };
}
