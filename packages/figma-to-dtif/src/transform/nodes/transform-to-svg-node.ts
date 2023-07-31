import {
  convert2DMatrixTo3DMatrix,
  exportAndUploadNode,
  exportNodeCloned,
  sha256,
} from '@/helpers';
import {
  TSVGCompatibleNode,
  TTransformNodeOptions,
  TUploadStaticData,
} from '@/types';
import { svgParser } from '@pda/svgson';
import { TSVGNode } from '@pda/types/dtif';

export async function transformToSVGNode(
  node: TSVGCompatibleNode,
  options: TTransformNodeOptions
): Promise<TSVGNode> {
  const { svg: { inline = true, exportOptions } = {}, exportContainerNode } =
    options;
  let svgNode: TSVGNode;

  // Export node as inline SVG
  if (inline) {
    svgNode = await transformToInlineSVGNode(node, {
      containerNode: exportContainerNode,
    });
  }

  // Export node as byte array
  else {
    svgNode = await transformToExportedSVGNode(node, {
      inline: exportOptions?.inline ?? true,
      containerNode: exportContainerNode,
      exportSettings: { format: exportOptions?.format ?? 'SVG' },
      uploadStaticData: exportOptions?.uploadStaticData,
    });
  }

  return svgNode;
}

async function transformToInlineSVGNode(
  node: TSVGCompatibleNode,
  options: { containerNode: TTransformNodeOptions['exportContainerNode'] }
): Promise<TSVGNode> {
  const { containerNode } = options;

  // Export node as inline SVG
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
    id: node.id,
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
  config: {
    inline: boolean;
    exportSettings: ExportSettings;
    uploadStaticData?: TUploadStaticData;
    containerNode?: FrameNode;
  }
): Promise<TSVGNode> {
  const { uploadStaticData, inline, exportSettings, containerNode } = config;
  let hash: string;
  let content: Uint8Array | string | undefined;

  // Export and upload node
  if (uploadStaticData != null && !inline) {
    const uploadResponse = await exportAndUploadNode(node, {
      uploadStaticData,
      clone: containerNode != null ? { containerNode } : true,
      exportSettings,
    });
    hash = uploadResponse.key;
    content = undefined;
  }

  // Export node and put it inline
  else {
    content = await exportNodeCloned(node, exportSettings);
    hash = sha256(content);
  }

  return {
    type: 'SVG',
    isExported: true,
    format: config.exportSettings.format as any,
    hash,
    content,
    // BaseNode mixin
    id: node.id,
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

  // TODO:
  return null as any;
}
