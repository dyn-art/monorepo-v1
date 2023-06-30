import { exportNode } from './export-node';
import { resetNodeTransform } from './reset-node-transform';

export async function exportNodeCloned(
  node: SceneNode,
  exportSettings: ExportSettings
): Promise<Uint8Array> {
  // TODO: add clone to specific clone group so that its organized
  const clone = node.clone();

  // Reset transform before upload so that the transform is not embedded into the SVG
  resetNodeTransform(clone);

  try {
    // Export node to SVG or raster image
    const data = await exportNode(clone, exportSettings);

    clone.remove();
    return data;
  } catch (e) {
    clone.remove();
    throw e;
  }
}
