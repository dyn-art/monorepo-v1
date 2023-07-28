import { OpenAPIFetchClient, isStatusCode } from '@pda/openapi-fetch';
import { paths } from '../gen/webfonts-v1';
import { logger } from '../logger';

export class GoogleService {
  public readonly googleClient: OpenAPIFetchClient<paths>;

  constructor(googleClient: OpenAPIFetchClient<paths>) {
    this.googleClient = googleClient;
  }

  public async getWebFonts() {
    const response = await this.googleClient.get('/webfonts', {
      queryParams: {
        key: '', // Set by middleware
      },
    });
    if (response.isError) {
      logger.error(response.error.message);
      throw response.error;
    } else {
      return response.data;
    }
  }

  public async getWebFontWOFF2File(
    family: string,
    options: { fontWeight?: number; variant?: 'italic' | 'regular' } = {}
  ): Promise<string | null> {
    const { fontWeight = 400, variant = 'regular' } = options;

    // Send request
    const response = await this.googleClient.get('/webfonts', {
      queryParams: {
        key: '', // Set by middleware
        family,
        capability: 'WOFF2',
      },
    });

    // Handle request response
    if (response.isError && isStatusCode(response.error, 404)) {
      return null;
    } else if (response.isError) {
      logger.error(response.error.message);
      throw response.error;
    } else {
      const data = response.data;
      let fileUrl: string | null = null;

      // Build variant identifier
      let variantIdentifier: string;
      if (fontWeight === 400) {
        variantIdentifier = variant;
      } else {
        variantIdentifier = `${fontWeight}${
          variant === 'regular' ? '' : variant
        }`;
      }

      // Check whether response data includes searched variant
      if (data.items != null && data.items.length > 0) {
        for (const item of data.items) {
          if (item.files != null && variantIdentifier in item.files) {
            fileUrl = item.files[variantIdentifier] ?? null;
            if (fileUrl != null) {
              break;
            }
          }
        }
      }

      return fileUrl;
    }
  }
}
