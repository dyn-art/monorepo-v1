import { ENodeTypes, TSVGNode } from '@pda/dtif-types';
import { UploadStaticDataException } from '../exceptions/UploadStaticDataException';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { convert2DMatrixTo3DMatrix } from '../helper';
import { logger } from '../logger';
import { TSVGCompatibleNode, convertNodeToSvg, sha256 } from '../utils';

export async function formatToSvgNode(
  node: TSVGCompatibleNode,
  config: TFormatNodeConfig
): Promise<TSVGNode> {
  // Convert the node type to SVG
  const svgData = await convertNodeToSvg(node);

  // Upload SVG data
  const svgHash = sha256(svgData);
  const key = await config.uploadStaticData(svgHash, svgData, {
    name: 'svg',
    mimeType: 'image/svg+xml',
    ending: '.svg',
  });
  if (key === null) {
    throw new UploadStaticDataException(`Failed to upload SVG data!`, node);
  }

  logger.success(
    `Formatted '${node.type}' node '${node.name}' to SVG and uploaded content to S3 bucket under the key '${key}'`
  );

  return {
    type: ENodeTypes.SVG,
    svgHash: key,
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
    effects: node.effects,
  };
}
