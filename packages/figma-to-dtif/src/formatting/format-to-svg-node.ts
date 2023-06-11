import { ENodeTypes, TEffect, TSVGNode } from '@pda/dtif-types';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { convert2DMatrixTo3DMatrix } from '../helper';
import { logger } from '../logger';
import { TSVGCompatibleNode } from '../types';
import { exportAndUploadNode } from '../utils/export-and-upload-node';

export async function formatToSvgNode(
  node: TSVGCompatibleNode,
  config: TFormatNodeConfig
): Promise<TSVGNode> {
  // Convert node to SVG data and try to upload SVG data
  const { hash, data, uploaded } = await exportAndUploadNode(node, {
    uploadStaticData: config.uploadStaticData,
    export: { format: 'SVG' },
  });

  logger.success(`Formatted '${node.type}' node '${node.name}' to SVG.`);

  return {
    type: ENodeTypes.SVG,
    hash,
    inline: uploaded ? undefined : data,
    // BaseNode mixin
    id: node.id,
    name: node.name,
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects as TEffect[],
  };
}
