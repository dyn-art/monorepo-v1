import {
  OpenAPIFetchClient,
  RawFetchClient,
  isStatusCode,
} from '@pda/openapi-fetch';
import { paths } from '../gen/webfonts-v1';
import { logger } from '../logger';

export class GoogleService {
  public readonly googleClient: OpenAPIFetchClient<paths>;
  private readonly _rawClient: RawFetchClient;

  public static REGULAR_FONT_WEIGHT = 400;

  constructor(googleClient: OpenAPIFetchClient<paths>) {
    this.googleClient = googleClient;
    this._rawClient = new RawFetchClient();
  }

  public async getWebFonts(
    options: Omit<paths['/webfonts']['get']['parameters']['query'], 'key'> = {}
  ) {
    const response = await this.googleClient.get('/webfonts', {
      queryParams: {
        key: '', // Set by middleware
        ...options,
      },
    });
    if (response.isError && isStatusCode(response.error, 500)) {
      return null;
    } else if (response.isError) {
      logger.error(response.error.message);
      throw response.error;
    } else {
      return response.data;
    }
  }

  public async getWebFontWOFF2FileURL(
    family: string,
    options: {
      fontWeight?: number;
      style?: 'italic' | 'regular';
    } = {}
  ): Promise<string | null> {
    const {
      fontWeight = GoogleService.REGULAR_FONT_WEIGHT,
      style = 'regular',
    } = options;
    let fileUrl: string | null = null;

    // Fetch matching fonts to font family
    const searchResult = await this.getWebFonts({
      capability: 'WOFF2',
      family,
    });
    const fonts = searchResult?.items;
    if (!Array.isArray(fonts)) {
      return null;
    }

    // Build font variant identifier
    // e.g. 'regular', '100', '200', '200itlaic'
    let variant: string;
    if (fontWeight === GoogleService.REGULAR_FONT_WEIGHT) {
      variant = style;
    } else {
      variant = `${fontWeight}${style === 'regular' ? '' : style}`;
    }

    // Check whether constructed font variant identifier is present
    // in matched font family variants (returned by google API)
    for (const item of fonts) {
      if (
        item.variants != null &&
        item.variants.includes(variant) &&
        item.files != null
      ) {
        fileUrl = item.files[variant] ?? null;
        if (fileUrl != null) {
          break;
        }
      }
    }

    // Check whether its http url (for figma cors-origin)
    if (fileUrl?.startsWith('http://')) {
      fileUrl = fileUrl.replace('http://', 'https://');
    }

    return fileUrl;
  }

  public async downloadWebFontWOFF2File(
    family: string,
    options: { fontWeight?: number; style?: 'italic' | 'regular' } = {}
  ): Promise<Uint8Array | null> {
    // Get font download url
    const downloadUrl = await this.getWebFontWOFF2FileURL(family, options);
    if (downloadUrl == null) {
      return null;
    }

    // Download data from font download url
    const response = await this._rawClient.get(downloadUrl, {
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
