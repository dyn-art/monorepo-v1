import { logger } from '../../../../shared';
import { coreConfig } from '../../../environment';
import { getImageType } from './get-image-type';

// TODO: create core-api package and use axios with custom fetch adapter

async function getPreSignedUploadUrl(
  key: string
): Promise<{ uploadUrl: string; key: string }> {
  const response = await fetch(
    `${coreConfig.baseUrl}/media/pre-signed-upload-url?contentType=image/png&key=${key}`,
    {
      method: 'GET',
      headers: {
        'X-CORS-API-KEY': coreConfig.corsApiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get pre-signed URL: ${response.status} - ${response.statusText}`
    );
  }

  return await response.json();
}

export async function uploadDataToBucket(
  key: string,
  data?: Uint8Array
): Promise<string | null> {
  if (data == null) return null;

  try {
    // Get pre signed upload url
    const { uploadUrl, key: fileKey } = await getPreSignedUploadUrl(key);

    // Upload file to S3-Bucket
    const imageType = getImageType(data);
    if (imageType == null) {
      throw new Error('Failed to determine image type from data!');
    }
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': imageType.mimeType,
      },
      body: data,
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `Failed to upload file to bucket: ${uploadResponse.status} - ${uploadResponse.statusText}`
      );
    }

    return fileKey;
  } catch (e) {
    logger.error('Failed to upload data to bucket!', e);
  }
  return null;
}
