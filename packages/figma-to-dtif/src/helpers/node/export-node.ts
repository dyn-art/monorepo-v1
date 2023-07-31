import { ExportNodeException } from '@/exceptions';

export async function exportNode(
  node: SceneNode,
  config: ExportSettingsSVGString
): Promise<string>;

export async function exportNode(
  node: SceneNode,
  config: ExportSettings
): Promise<Uint8Array>;

export async function exportNode(
  node: SceneNode,
  config: ExportSettings | ExportSettingsSVGString
): Promise<Uint8Array | string> {
  try {
    return await node.exportAsync(config as ExportSettings);
  } catch (error) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = JSON.stringify(error);
    }
    throw new ExportNodeException(
      `Failed to export node '${node.name}' as ${config.format}: ${errorMessage}`,
      node,
      error instanceof Error ? error : undefined
    );
  }
}
