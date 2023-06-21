import { NodeToSVGConversionException } from '../exceptions';

export async function exportNode(
  node: SceneNode,
  config: ExportSettings
): Promise<Uint8Array> {
  try {
    return await node.exportAsync(config);
  } catch (error) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = JSON.stringify(error);
    }
    throw new NodeToSVGConversionException(
      `Failed to export node '${node.name}' as ${config.format}: ${errorMessage}`,
      node
    );
  }
}
