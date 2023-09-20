import {
  OpenAPIFetchClientThrow,
  RawFetchClient,
  isStatusCode,
} from '@dyn/openapi-fetch';
import { paths } from '@dyn/types/core';
import { logger } from '../logger';

export class CoreService {
  public readonly coreClient: OpenAPIFetchClientThrow<paths>;
  private readonly _rawClient: RawFetchClient;

  constructor(coreClient: OpenAPIFetchClientThrow<paths>) {
    this.coreClient = coreClient;
    this._rawClient = new RawFetchClient();
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

  public async getPreSignedDownloadUrl(key: string): Promise<string | null> {
    // Send request
    const response = await this.coreClient.get(
      '/v1/media/pre-signed-download-url/{key}',
      {
        pathParams: {
          key,
        },
      }
    );

    // Handle request response
    if (response.isError && isStatusCode(response.error, 404)) {
      return null;
    } else if (response.isError) {
      throw response.error;
    } else {
      return response.data.download_url ?? null;
    }
  }

  public async getDownloadUrl(key: string): Promise<string | null> {
    // Send request
    const response = await this.coreClient.get('/v1/media/download-url/{key}', {
      pathParams: {
        key,
      },
    });

    // Handle request response
    if (response.isError && isStatusCode(response.error, 404)) {
      return null;
    } else if (response.isError) {
      throw response.error;
    } else {
      return response.data.download_url ?? null;
    }
  }

  public async downloadJsonFromS3<
    TResponse extends Record<string, any> = Record<string, any>
  >(key: string): Promise<TResponse | null> {
    // Get pre signed download url
    const downloadUrl = await this.getPreSignedDownloadUrl(key);
    if (downloadUrl == null) {
      return null;
    }

    // Download data from pre signed download url
    const response = await this._rawClient.get<TResponse>(downloadUrl);

    // Handle download request response
    if (response.isError && isStatusCode(response.error, 404)) {
      return null;
    } else if (response.isError) {
      throw response.error;
    } else {
      return response.data;
    }
  }

  public async downloadWebFontWOFF2File(
    family: string,
    options: { fontWeight?: number; style?: 'italic' | 'regular' } = {}
  ): Promise<Uint8Array | null> {
    const { fontWeight, style } = options;

    // Download data from font download url
    const response = await this.coreClient.get('/v1/media/font/source', {
      queryParams: {
        family,
        font_weight: fontWeight,
        style,
      },
      parseAs: 'arrayBuffer',
    });

    // Handle download request response
    if (response.isError && isStatusCode(response.error, 404)) {
      return null;
    } else if (response.isError) {
      throw response.error;
    } else {
      return new Uint8Array(response.data);
    }
  }
}
