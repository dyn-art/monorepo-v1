import { UploadStaticDataException } from '@/exceptions';
import { TUploadStaticData } from '@/types';
import { getImageType, sha256 } from '../other';
import { exportNode } from './export-node';
import { exportNodeCloned } from './export-node-cloned';

export async function exportAndUploadNode(
  node: SceneNode,
  config: TExportAndUploadNodeConfig
): Promise<TExportAndUploadNodeResponse> {
  const { clone = true, uploadStaticData, exportSettings } = config;

  // Export node
  const data = clone
    ? await exportNodeCloned(node, {
        ...exportSettings,
        containerNode:
          typeof clone === 'object' ? clone.containerNode : undefined,
      })
    : await exportNode(node, exportSettings);

  // Upload exported node data
  const key = config.key ?? sha256(data);
  try {
    const finalKey = await uploadStaticData(
      key,
      data,
      getImageType(data) ?? undefined
    );
    return { key: finalKey, data };
  } catch (error) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = JSON.stringify(error);
    }
    throw new UploadStaticDataException(
      `Failed to upload node with the key '${key}' exported as '${config.exportSettings.format}': ${errorMessage}`,
      node,
      error instanceof Error ? error : undefined
    );
  }
}

export type TExportAndUploadNodeConfig = {
  key?: string;
  exportSettings: ExportSettings;
  uploadStaticData: TUploadStaticData;
  clone?:
    | {
        containerNode?: FrameNode;
      }
    | boolean;
};

type TExportAndUploadNodeResponse = {
  key: string;
  data: Uint8Array;
};
