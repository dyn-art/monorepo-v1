import { exportNode } from './export-node';
import { resetFigmaNodeTransform } from './reset-node-transform';

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
    resetFigmaNodeTransform(clone);

    // Export node
    const data = await exportNode(clone, exportNodeSettings as ExportSettings);

    return data;
  } finally {
    clone.remove();
  }
}
