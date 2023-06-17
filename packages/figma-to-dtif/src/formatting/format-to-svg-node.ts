import { ENodeTypes, TEffect, TSVGNode } from '@pda/dtif-types';
import { logger } from '../logger';
import { TSVGCompatibleNode } from '../types';
import { convert2DMatrixTo3DMatrix, exportAndUploadNode } from '../utils';
import { TFormatNodeConfig } from './format-node-to-dtif';

export async function formatToSvgNode(
  node: TSVGCompatibleNode,
  config: TFormatNodeConfig
): Promise<TSVGNode> {
  // Convert node to SVG data and try to upload SVG data
  const { hash, data, uploaded } = await exportAndUploadNode(node, {
    uploadStaticData: config.uploadStaticData,
    exportSettings: { format: 'SVG' },
  });

  logger.success(`Formatted '${node.type}' node '${node.name}' to SVG.`);

  return {
    type: ENodeTypes.SVG,
    hash,
    inline: uploaded ? undefined : data,
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
    effects: node.effects as TEffect[],
  };
}
