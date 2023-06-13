import { UploadStaticDataException } from '../exceptions';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { exportNode } from './export-node';
import { getImageType } from './get-image-type';
import { sha256 } from './sha256';

export async function exportAndUploadNode(
  node: SceneNode,
  config: {
    uploadStaticData: TFormatNodeConfig['uploadStaticData'];
    export: ExportSettings;
  }
): Promise<{ hash: string; data: Uint8Array; uploaded: boolean }> {
  let uploaded = false;

  // Convert node to SVG data
  const data = await exportNode(node, config.export);

  // Upload SVG data
  let hash = sha256(data);
  if (config.uploadStaticData != null) {
    hash = await config.uploadStaticData(
      hash,
      data,
      getImageType(data) ?? undefined
    );
    if (hash === null) {
      throw new UploadStaticDataException(
        `Failed to upload ${config.export.format} with the hash ${hash} to S3 bucket!`,
        node
      );
    }
    uploaded = true;
  }

  return { hash, data, uploaded };
}
