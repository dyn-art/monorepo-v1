import axios, { AxiosInstance } from 'axios';
import { spotifyConfig } from '../environment';
import { TSpotifyAuthResponseDto } from './types';

export class OAuth2Service {
  private httpClient: AxiosInstance;

  private config: TOAuth2Config;

  private accessToken: string | null = null;
  private expiresAt = 0;
  private puffer = 60 * 5; // s

  constructor(config: TOAuth2Config, httpClient: AxiosInstance = axios) {
    this.config = config;
    this.httpClient = httpClient;
  }

  /**
   * Retrieves the access token, either from cache or by making a new request.
   * @param force - (optional) If true, forces a new token request regardless of the token's remaining validity. Defaults to false.
   * @returns The access token, or null if an error occurred during token retrieval.
   */
  public async getAccessToken(force = false): Promise<string | null> {
    if (Date.now() < this.expiresAt && this.accessToken != null && !force) {
      return this.accessToken;
    }
    return await this.retrieveAccessTokenViaClientCredentialsFlow();
  }

  /**
   * Retrieves the access token using the Client Credentials Flow.
   * https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/
   * @returns The access token, or null if an error occurred during token retrieval.
   * @private
   */
  private async retrieveAccessTokenViaClientCredentialsFlow(): Promise<
    string | null
  > {
    try {
      const headers = this.buildCredentialsFlowAuthHeaders();
      const body = 'grant_type=client_credentials';

      const response = await this.httpClient.post<TSpotifyAuthResponseDto>(
        spotifyConfig.auth.tokenEndpoint,
        body,
        { headers }
      );

      return this.handleCredentialsFlowAuthResponse(response.data);
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  private buildCredentialsFlowAuthHeaders(): Record<string, string> {
    const authString = `${this.config.clientId}:${this.config.clientSecret}`;
    const encodedAuthString = Buffer.from(authString).toString('base64');

    return {
      Authorization: `Basic ${encodedAuthString}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  private handleCredentialsFlowAuthResponse(
    data: TSpotifyAuthResponseDto
  ): string | null {
    if (data.access_token == null || data.expires_in == null) return null;

    this.accessToken = data.access_token;
    this.expiresAt = Date.now() + (data.expires_in - this.puffer) * 1000;

    console.log(
      `Successfully fetched new Spotify Access Token that will expire at ${new Date(
        this.expiresAt
      ).toLocaleTimeString()}`
    );

    return this.accessToken;
  }
}

type TOAuth2Config = {
  /**
   * The client ID for the OAuth2 application.
   */
  clientId: string;
  /**
   * The client secret for the OAuth2 application.
   */
  clientSecret: string;
};
