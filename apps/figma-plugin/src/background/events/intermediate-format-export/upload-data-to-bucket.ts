import { UploadStaticDataException } from '@pda/figma-to-dtif';
import { coreConfig } from '../../environment';

async function getPreSignedUploadUrl(
  key: string,
  scope: string,
  contentType: string
): Promise<{ uploadUrl: string; key: string }> {
  // Build url
  const url = `${
    coreConfig.baseUrl
  }/media/pre-signed-upload-url?contentType=${encodeURIComponent(
    contentType
  )}&key=${encodeURIComponent(key)}&scope=${encodeURIComponent(scope)}`;

  // Send request
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-CORS-API-KEY': coreConfig.corsApiKey,
    },
  });

  // Handle error
  if (!response.ok) {
    throw new UploadStaticDataException(
      `Failed to get pre-signed URL: ${response.status} - ${response.statusText}`
    );
  }

  return await response.json();
}

export async function uploadDataToBucket(
  key: string,
  data: Uint8Array,
  mimeType: string
): Promise<string> {
  const scope = 'public-read';

  const { uploadUrl, key: fileKey } = await getPreSignedUploadUrl(
    key,
    scope,
    mimeType
  );

  // Send request
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mimeType,
      'x-amz-acl': scope,
    },
    body: data,
  });

  // Handle error
  if (!uploadResponse.ok) {
    throw new UploadStaticDataException(
      `Failed to upload file to S3 bucket: ${uploadResponse.status} - ${uploadResponse.statusText}`
    );
  }

  return fileKey;
}
