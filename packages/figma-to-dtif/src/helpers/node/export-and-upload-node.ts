import { TUploadStaticData, TUploadStaticDataResponse } from '@/types';
import { getImageType, uploadStaticData } from '../other';
import { exportNode } from './export-node';
import { exportNodeCloned } from './export-node-cloned';

export async function exportAndUploadNode(
  node: SceneNode,
  config: TExportAndUploadNodeConfig
): Promise<TExportAndUploadNodeResponse> {
  const {
    clone = true,
    uploadStaticData: uploadStaticDataCallback,
    exportSettings,
    key,
  } = config;

  // Export node
  const data = clone
    ? await exportNodeCloned(node, {
        ...exportSettings,
        containerNode:
          typeof clone === 'object' ? clone.containerNode : undefined,
      })
    : await exportNode(node, exportSettings);

  // Upload exported node data
  const uploadResponse = await uploadStaticData(
    uploadStaticDataCallback,
    data,
    {
      node,
      key,
      contentType: getImageType(data) ?? undefined,
    }
  );

  return { ...uploadResponse, data };
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
  data: Uint8Array;
} & TUploadStaticDataResponse;
