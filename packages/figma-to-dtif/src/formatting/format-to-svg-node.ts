import { TSVGNode } from '@pda/dtif-types';
import { NodeToSvgConversionException } from '../exceptions';
import { UploadToBucketException } from '../exceptions/UploadToBucketException';
import { uploadDataToBucket } from '../helper';
import { logger } from '../logger';
import { sha256 } from '../utils';
import { TBucketConfig, TFormatNodeOptions } from './format-node';

export async function formatToSvgNode(
  node: TSVGCompatibleNode,
  options: TFormatNodeOptions
): Promise<TSVGNode> {
  // Convert the node type to SVG
  const svgData = await convertNodeToSvg(node);

  // Upload the SVG data to S3 bucket
  const svgHash = await uploadSvgDataToS3Bucket(
    svgData,
    options.bucket.getPresignedUrl
  );

  logger.success(
    `Formatted '${node.type}' node '${node.name}' to SVG and uploaded content to S3 bucket under the key '${svgHash}'`
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

async function convertNodeToSvg(node: TSVGCompatibleNode): Promise<Uint8Array> {
  try {
    return await node.exportAsync({ format: 'SVG' });
  } catch (error) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = JSON.stringify(error);
    }
    throw new NodeToSvgConversionException(
      `Failed to export node '${node.name}' as SVG: ${errorMessage}`
    );
  }
}

async function uploadSvgDataToS3Bucket(
  svgData: Uint8Array,
  getPreSignedUploadUrl: TBucketConfig['getPresignedUrl']
): Promise<string> {
  const svgHash = sha256(svgData);
  const result = await uploadDataToBucket({
    key: svgHash,
    data: svgData,
    getPreSignedUploadUrl,
  });
  if (result === null) {
    throw new UploadToBucketException(
      `Failed to upload SVG data to S3 bucket!`
    );
  }
  return result;
}

export type TSVGCompatibleNode =
  | LineNode
  | EllipseNode
  | PolygonNode
  | StarNode
  | VectorNode
  | BooleanOperationNode
  | GroupNode
  | FrameNode
  | RectangleNode
  | InstanceNode
  | ComponentNode;
