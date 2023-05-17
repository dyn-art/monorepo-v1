import { logger } from '../../../../shared';
import { coreConfig } from '../../../environment';
import { getImageType } from './get-image-type';

// TODO: create core-api package and use axios with custom fetch adapter

async function getPreSignedUploadUrl(
  key: string,
  scope: string,
  contentType: string
): Promise<{ uploadUrl: string; key: string }> {
  const response = await fetch(
    `${coreConfig.baseUrl}/media/pre-signed-upload-url?contentType=${contentType}&key=${key}&scope=${scope}`,
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
  data?: Uint8Array,
  contentType?: string
): Promise<string | null> {
  if (data == null) return null;
  const scope = 'public-read';

  try {
    // Get pre signed upload url
    const mimeType = contentType ?? getImageType(data)?.mimeType;
    if (mimeType == null) {
      throw new Error('Failed to determine image type from data!');
    }
    const { uploadUrl, key: fileKey } = await getPreSignedUploadUrl(
      key,
      scope,
      mimeType
    );

    // Upload file to S3-Bucket
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
        'x-amz-acl': scope,
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
