import { UploadStaticDataException } from '@/exceptions';
import {
  TContentType,
  TUploadStaticData,
  TUploadStaticDataResponse,
} from '@/types';
import { sha256 } from './sha256';

export async function uploadStaticData(
  callback: TUploadStaticData,
  data: Uint8Array,
  config: { key?: string; contentType?: TContentType; node: SceneNode }
): Promise<TUploadStaticDataResponse> {
  const { key = sha256(data), contentType, node } = config;
  try {
    return await callback(key, data, contentType ?? undefined);
  } catch (error) {
    throw new UploadStaticDataException(key, node, error);
  }
}
