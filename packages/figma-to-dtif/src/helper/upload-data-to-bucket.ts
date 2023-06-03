import { UploadToBucketException } from '../exceptions';
import { TBucketConfig } from '../formatting';
import { getImageType } from '../utils';

export async function uploadDataToBucket(args: {
  key: string;
  data: Uint8Array;
  contentType?: string;
  getPreSignedUploadUrl: TBucketConfig['getPresignedUrl'];
}): Promise<string> {
  const {
    key,
    data,
    contentType: mimeType = getImageType(data)?.mimeType,
    getPreSignedUploadUrl,
  } = args;
  const scope = 'public-read';

  // Handle not found mime type
  if (mimeType == null) {
    throw new UploadToBucketException(
      `Failed to determine image type from provided data for upload request with key '${key}'!`
    );
  }

  // Get pre signed upload url
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

  // Handle error
  if (!uploadResponse.ok) {
    throw new UploadToBucketException(
      `Failed to upload file to bucket: ${uploadResponse.status} - ${uploadResponse.statusText}`
    );
  }

  return fileKey;
}
