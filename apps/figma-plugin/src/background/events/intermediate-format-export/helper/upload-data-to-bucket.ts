import { logger } from '../../../../shared';
import { coreConfig } from '../../../environment';
import { getImageType } from './get-image-type';

export async function uploadDataToBucket(
  key: string,
  data?: Uint8Array
): Promise<string | null> {
  if (data == null) return null;

  try {
    // Get pre signed upload url
    const response = await fetch(
      `${coreConfig.baseUrl}/media/pre-signed-upload-url?contentType=image/png&key=${key}`,
      {
        method: 'GET',
        headers: {
          'X-CORS-API-KEY': coreConfig.corsApiKey,
        },
      }
    );
    const { uploadUrl, key: fileKey } = await response.json();

    // Upload file to S3-Bucket
    if (typeof uploadUrl === 'string' && typeof fileKey === 'string') {
      const imageType = getImageType(data);
      if (imageType != null) {
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': imageType.mimeType,
          },
          body: data,
        });
      } else {
        throw new Error('Failed to determine image type from data!');
      }
    } else {
      throw new Error('Failed to get retrieve presigned upload url!');
    }
    return fileKey;
  } catch (e) {
    logger.error('Failed to upload data to bucket!', e);
  }
  return null;
}
