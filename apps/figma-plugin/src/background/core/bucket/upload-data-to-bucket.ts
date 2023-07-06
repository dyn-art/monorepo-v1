import { coreService, fetchClient } from '../api';
import { UploadToBucketException } from './exceptions';

export async function uploadDataToBucket(
  key: string,
  data: Uint8Array,
  mimeType: string
): Promise<string> {
  const scope = 'public-read';
  let fileKey = key;

  try {
    const preSignedUploadUrl = await coreService.getPreSignedUploadUrl(
      fileKey,
      scope,
      mimeType
    );

    // Upload if object doesn't already exist
    if (!preSignedUploadUrl.objectExists) {
      const { uploadUrl } = preSignedUploadUrl;
      fileKey = preSignedUploadUrl.key;

      await fetchClient.putThrow(uploadUrl, data, {
        headers: {
          'Content-Type': mimeType,
          'x-amz-acl': scope,
        },
        parseAs: 'stream',
        bodySerializer: (body) => body,
      });
    }
  } catch (error) {
    throw new UploadToBucketException(`Failed to upload file to S3 bucket!`);
  }

  return fileKey;
}
