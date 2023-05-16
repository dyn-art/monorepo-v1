import CryptoJS from 'crypto-js';
import { logger } from '../../../../shared';
import { TSVGNode } from '../../../../shared/types/intermediate-format';
import { uploadDataToBucket } from './upload-data-to-bucket';

export async function formatMiscellaneousNodes(
  node:
    | LineNode
    | EllipseNode
    | PolygonNode
    | StarNode
    | VectorNode
    | BooleanOperationNode
): Promise<TSVGNode> {
  // Convert the node type to SVG
  const svgData = await node.exportAsync({ format: 'SVG' });
  let svgHash: string | null = generateHash(svgData);
  svgHash = await uploadDataToBucket(svgHash, svgData);
  if (svgHash == null) {
    throw Error(
      `Failed to upload svg data from node '${node.name}' to bucket!`
    );
  }
  logger.info(
    `Formatted '${node.type}' to svg and uploaded content to bucket under the key '${svgHash}'`
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

function generateHash(data: Uint8Array): string {
  const hash = CryptoJS.SHA256(data.toString());
  return hash.toString(CryptoJS.enc.Hex);
}
