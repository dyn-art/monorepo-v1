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
    throw new ExportNodeException(config.format, node, error);
  }
}
