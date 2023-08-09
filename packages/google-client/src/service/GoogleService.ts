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

  public async getFontFileURL(
    family: string,
    options: {
      fontWeight?: number;
      fontStyle?: 'italic' | 'regular';
      capability?: 'TTF' | 'WOFF2';
    } = {}
  ): Promise<string | null> {
    const {
      fontWeight = GoogleService.REGULAR_FONT_WEIGHT,
      fontStyle = 'regular',
      capability = 'TTF',
    } = options;
    let fileUrl: string | null = null;

    // Fetch matching fonts to font family
    const searchResult = await this.getWebFonts({
      capability: capability === 'WOFF2' ? 'WOFF2' : undefined, // Default is TTF
      family,
    });
    const fonts = searchResult?.items;
    if (!Array.isArray(fonts)) {
      return null;
    }

    // Check whether searched font variant is present
    // in googles matched font family variants
    const fontVariantKey = this.buildFontVariantKey(fontWeight, fontStyle);
    for (const item of fonts) {
      if (
        item.variants != null &&
        item.variants.includes(fontVariantKey) &&
        item.files != null
      ) {
        fileUrl = item.files[fontVariantKey] ?? null;
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

  public async downloadFontFile(
    family: string,
    options: {
      fontWeight?: number;
      style?: 'italic' | 'regular';
      capability?: 'TTF' | 'WOFF2';
    } = {}
  ): Promise<Uint8Array | null> {
    // Get font download url
    const downloadUrl = await this.getFontFileURL(family, options);
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

  // Build font variant identifier key
  // e.g. 'regular', '100', '200', '200itlaic'
  public buildFontVariantKey(
    fontWeight: number = GoogleService.REGULAR_FONT_WEIGHT,
    fontStyle: 'regular' | 'italic' = 'regular'
  ) {
    if (fontWeight === GoogleService.REGULAR_FONT_WEIGHT) {
      return fontStyle;
    } else if (fontStyle === 'regular') {
      return `${fontWeight}`;
    } else {
      return `${fontWeight}${fontStyle}`;
    }
  }
}
