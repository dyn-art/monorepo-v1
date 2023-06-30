import { UploadStaticDataException } from '../exceptions';
import { TUploadStaticData } from '../types';
import { exportNode } from './export-node';
import { exportNodeCloned } from './export-node-cloned';
import { getImageType } from './get-image-type';
import { sha256 } from './sha256';

export async function exportAndUploadNode(
  node: SceneNode,
  config: {
    exportSettings: ExportSettings;
    uploadStaticData?: TUploadStaticData;
    clone?: boolean;
  }
): Promise<{ hash: string; data: Uint8Array; uploaded: boolean }> {
  const {
    clone: shouldClone = true,
    uploadStaticData,
    exportSettings,
  } = config;
  let uploaded = false;

  // Export node
  const data = shouldClone
    ? await exportNodeCloned(node, exportSettings)
    : await exportNode(node, exportSettings);

  // Upload exported SVG data
  let hash = sha256(data);
  if (typeof uploadStaticData === 'function') {
    hash = await uploadStaticData(hash, data, getImageType(data) ?? undefined);
    if (hash === null) {
      throw new UploadStaticDataException(
        `Failed to upload ${config.exportSettings.format} with the hash ${hash}!`,
        node
      );
    }
    uploaded = true;
  }

  return { hash, data, uploaded };
}
