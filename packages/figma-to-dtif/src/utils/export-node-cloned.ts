import { exportNode } from './export-node';
import { resetNodeTransform } from './reset-node-transform';

export async function exportNodeCloned(
  node: SceneNode,
  exportSettings: ExportSettings & {
    tempFrameNode?: FrameNode;
  }
): Promise<Uint8Array> {
  const { tempFrameNode, ...exportNodeSettings } = exportSettings;
  const clone = node.clone();
  try {
    // Add clone to context frame node so in case of error
    // there are no random temporary nodes flying around in the scene
    if (tempFrameNode != null) {
      tempFrameNode.appendChild(clone);
    }

    // Reset transform before upload so that the transform is not embedded into the SVG
    resetNodeTransform(clone);

    // Export node to SVG or raster image
    const data = await exportNode(clone, exportNodeSettings);

    clone.remove();
    return data;
  } catch (error) {
    clone.remove();
    throw error;
  }
}
