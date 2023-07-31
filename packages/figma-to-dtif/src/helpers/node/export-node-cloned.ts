import { exportNode } from './export-node';
import { resetNodeTransform } from './reset-node-transform';

export async function exportNodeCloned(
  node: SceneNode,
  config: ExportSettingsSVGString & {
    containerNode?: FrameNode;
  }
): Promise<string>;

export async function exportNodeCloned(
  node: SceneNode,
  config: ExportSettings & {
    containerNode?: FrameNode;
  }
): Promise<Uint8Array>;

export async function exportNodeCloned(
  node: SceneNode,
  exportSettings: (ExportSettings | ExportSettingsSVGString) & {
    containerNode?: FrameNode;
  }
): Promise<Uint8Array | string> {
  const { containerNode, ...exportNodeSettings } = exportSettings;

  // Clone node
  const clone = node.clone();

  try {
    // Append cloned node to container node for context
    if (containerNode != null) {
      containerNode.appendChild(clone);
    }

    // Reset transformation of node
    // so that it is not embedded into the exported format
    resetNodeTransform(clone);

    // Export node
    const data = await exportNode(clone, exportNodeSettings as ExportSettings);

    // Remove clone after successful export
    clone.remove();

    return data;
  } catch (error) {
    clone.remove();
    throw error;
  }
}
