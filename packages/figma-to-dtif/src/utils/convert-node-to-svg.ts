import { NodeToSVGConversionException } from '../exceptions';

export async function convertNodeToSvg(
  node: TSVGCompatibleNode
): Promise<Uint8Array> {
  try {
    return await node.exportAsync({ format: 'SVG' });
  } catch (error) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = JSON.stringify(error);
    }
    throw new NodeToSVGConversionException(
      `Failed to export node '${node.name}' as SVG: ${errorMessage}`,
      node
    );
  }
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
