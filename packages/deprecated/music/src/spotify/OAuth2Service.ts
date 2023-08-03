import axios, { AxiosInstance } from 'axios';
import { spotifyConfig } from '../environment';
import { TAuthResponseDto } from './types';

export class OAuth2Service {
  private readonly _httpClient: AxiosInstance;

  private readonly _config: TOAuth2Config;

  private _accessToken: string | null = null;
  private _accessTokenExpiresAt = 0;
  private readonly _accessTokenPuffer = 60 * 5; // 5min

  constructor(config: TOAuth2Config, httpClient: AxiosInstance = axios) {
    this._config = config;
    this._httpClient = httpClient;
  }

  /**
   * Retrieves the access token, either from cache or by making a new request.
   * @param force - (optional) If true, forces a new token request regardless of the token's remaining validity. Defaults to false.
   * @returns The access token, or null if an error occurred during token retrieval.
   */
  public async getAccessToken(force = false): Promise<string | null> {
    if (
      Date.now() < this._accessTokenExpiresAt &&
      this._accessToken != null &&
      !force
    ) {
      return this._accessToken;
    }
    return await this.retrieveAccessTokenByClientCredentialsFlow();
  }

  /**
   * Retrieves the access token using the Client Credentials Flow.
   * https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/
   * @returns The access token, or null if an error occurred during token retrieval.
   * @private
   */
  private async retrieveAccessTokenByClientCredentialsFlow(): Promise<
    string | null
  > {
    try {
      // Prepare headers
      const authString = `${this._config.clientId}:${this._config.clientSecret}`;
      const encodedAuthString = Buffer.from(authString).toString('base64');
      const headers = {
        Authorization: `Basic ${encodedAuthString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      // Prepare body
      const body = 'grant_type=client_credentials';

      // Send request
      const response = await this._httpClient.post<TAuthResponseDto>(
        spotifyConfig.auth.tokenEndpoint,
        body,
        { headers }
      );

      return this.handleRetrieveAccessTokenByCredentialsFlowAuthResponse(
        response.data
      );
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  private handleRetrieveAccessTokenByCredentialsFlowAuthResponse(
    data: TAuthResponseDto
  ): string | null {
    if (data.access_token == null || data.expires_in == null) return null;

    this._accessToken = data.access_token;
    this._accessTokenExpiresAt =
      Date.now() + (data.expires_in - this._accessTokenPuffer) * 1000;

    console.log(
      `Successfully retrieved new Spotify Access Token that will expire at ${new Date(
        this._accessTokenExpiresAt
      ).toLocaleTimeString()}`
    );

    return this._accessToken;
  }
}

type TOAuth2Config = {
  clientId: string;
  clientSecret: string;
};
