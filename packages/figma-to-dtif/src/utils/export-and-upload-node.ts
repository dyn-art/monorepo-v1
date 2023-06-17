import { UploadStaticDataException } from '../exceptions';
import { TFormatNodeConfig } from '../formatting/format-node-to-dtif';
import { exportNode } from './export-node';
import { getImageType } from './get-image-type';
import { resetNodeTransform } from './reset-node-transform';
import { sha256 } from './sha256';

export async function exportAndUploadNode(
  node: SceneNode,
  config: {
    uploadStaticData: TFormatNodeConfig['uploadStaticData'];
    exportSettings: ExportSettings;
    clone?: boolean;
  }
): Promise<{ hash: string; data: Uint8Array; uploaded: boolean }> {
  const {
    clone: shouldClone = true,
    uploadStaticData,
    exportSettings,
  } = config;
  let uploaded = false;

  // Reset transform before upload so that the transform is not embedded into the SVG
  const clone = shouldClone ? node.clone() : node;
  resetNodeTransform(clone);

  try {
    // Convert node to SVG data
    const data = await exportNode(clone, exportSettings);

    // Upload SVG data
    let hash = sha256(data);
    if (uploadStaticData != null) {
      hash = await uploadStaticData(
        hash,
        data,
        getImageType(data) ?? undefined
      );
      if (hash === null) {
        throw new UploadStaticDataException(
          `Failed to upload ${config.exportSettings.format} with the hash ${hash} to S3 bucket!`,
          node
        );
      }
      uploaded = true;
    }

    removeClone(clone, shouldClone);
    return { hash, data, uploaded };
  } catch (e) {
    removeClone(clone, shouldClone);
    throw e;
  }
}

function removeClone(clone: SceneNode, shouldClone: boolean) {
  if (shouldClone) {
    clone.remove();
  }
}
