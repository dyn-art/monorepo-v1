import { coreConfig } from '../../environment';
import { UploadToBucketException } from './exceptions';

async function getPreSignedUploadUrl(
  key: string,
  scope: string,
  contentType: string
): Promise<
  | { objectExists: false; uploadUrl: string; key: string }
  | { objectExists: true }
> {
  // Build url
  const url = `${
    coreConfig.baseUrl
  }/media/pre-signed-upload-url?contentType=${encodeURIComponent(
    contentType
  )}&key=${encodeURIComponent(key)}&scope=${encodeURIComponent(
    scope
  )}&overwrite${encodeURIComponent(false)}`;

  // Send request
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-CORS-API-KEY': coreConfig.corsApiKey,
    },
  });

  // Handle error
  if (!response.ok) {
    throw new UploadToBucketException(
      `Failed to get pre-signed URL: ${response.status} - ${response.statusText}`
    );
  }

  // Check whether object already exists
  if (response.status === 200) {
    return { objectExists: true };
  }

  const data = await response.json();
  return { objectExists: false, ...data };
}

export async function uploadDataToBucket(
  key: string,
  data: Uint8Array,
  mimeType: string
): Promise<string> {
  const scope = 'public-read';
  let fileKey = key;

  const preSignedUploadUrl = await getPreSignedUploadUrl(
    fileKey,
    scope,
    mimeType
  );

  // Upload if object doesn't already exist
  if (!preSignedUploadUrl.objectExists) {
    const { uploadUrl } = preSignedUploadUrl;
    fileKey = preSignedUploadUrl.key;

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
      throw new UploadToBucketException(
        `Failed to upload file to S3 bucket: ${uploadResponse.status} - ${uploadResponse.statusText}`
      );
    }
  }

  return fileKey;
}
