import { TSVGNode } from '@pda/shared-types';
import { logger } from '../../../../shared';
import { sha256 } from './sha256';
import { uploadDataToBucket } from './upload-data-to-bucket';

export async function formatToSvgNode(
  node:
    | LineNode
    | EllipseNode
    | PolygonNode
    | StarNode
    | VectorNode
    | BooleanOperationNode
    | GroupNode
    | FrameNode
    | RectangleNode
): Promise<TSVGNode> {
  // Convert the node type to SVG
  const svgData = await node.exportAsync({ format: 'SVG' });
  let svgHash: string | null = sha256(svgData);
  svgHash = await uploadDataToBucket(svgHash, svgData);
  if (svgHash == null) {
    throw Error(
      `Failed to upload svg data from node '${node.name}' to bucket!`
    );
  }

  logger.info(
    `Formatted '${node.type}' ('${node.name}') to svg and uploaded content to bucket under the key '${svgHash}'`
  );

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
