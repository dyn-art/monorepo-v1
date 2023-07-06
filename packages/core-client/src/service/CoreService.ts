import {
  OpenAPIFetchClientThrow,
  RawFetchClientThrow,
  isStatusCode,
} from '@pda/openapi-fetch';
import { paths } from '@pda/types/core';
import { logger } from '../logger';

export class CoreService {
  public readonly coreClient: OpenAPIFetchClientThrow<paths>;
  private readonly _rawClient: RawFetchClientThrow;

  constructor(coreClient: OpenAPIFetchClientThrow<paths>) {
    this.coreClient = coreClient;
    this._rawClient = new RawFetchClientThrow();
  }

  public async ping() {
    const response = await this.coreClient.get('/v1/ping');
    if (response.isError) {
      logger.error(response.error.message);
      return false;
    } else {
      return true;
    }
  }

  public async getPreSignedUploadUrl(
    key: string,
    scope: string,
    contentType: string
  ): Promise<
    | { objectExists: false; uploadUrl: string; key: string }
    | { objectExists: true }
  > {
    const response = await this.coreClient.get(
      '/v1/media/pre-signed-upload-url',
      {
        queryParams: {
          key,
          scope,
          content_type: contentType,
        },
      }
    );
    if (response.isError) {
      throw response.error;
    }
    const statusCode = response.raw.status;
    const data = response.data;

    // Check whether object already exists
    if (statusCode === 200) {
      return { objectExists: true };
    }

    return { objectExists: false, uploadUrl: data.upload_url, key: data.key };
  }

  public async downloadJsonFromS3<
    TResponse extends Record<string, any> = Record<string, any>
  >(key: string): Promise<TResponse | null> {
    try {
      const presignedDownloadUrlResponse = await this.coreClient.getThrow(
        '/v1/media/pre-signed-download-url/{key}',
        {
          pathParams: {
            key,
          },
        }
      );
      const downloadUrl = presignedDownloadUrlResponse.download_url;
      if (downloadUrl != null) {
        const downloadResponse = await this._rawClient.getThrow<TResponse>(
          downloadUrl
        );
        return downloadResponse;
      } else {
        return null;
      }
    } catch (error) {
      if (isStatusCode(error, 404)) {
        return null;
      } else {
        throw error;
      }
    }
  }
}
