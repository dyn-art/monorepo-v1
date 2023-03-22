import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { etsyConfig } from './environment';
import { TEtsyAuthResponseDto } from './types';

export class OAuth2Service {
  private readonly httpClient: AxiosInstance;

  public readonly config: Omit<TOAuth2Config, 'refresh'>;

  private readonly codeVerifiers: Record<string, string> = {};

  private accessToken: string | null = null;
  private accessTokenExpiresAt = 0;
  private readonly accessTokenPuffer = 60 * 5; // 5min

  private refreshToken: string | null = null; // 90 day life span
  private refreshTokenExpiresAt = 0;

  constructor(config: TOAuth2Config, httpClient: AxiosInstance = axios) {
    this.config = {
      clientId: config.clientId,
      redirectUrl: config.redirectUrl,
      scopes: config.scopes,
    };
    if (config.refresh) {
      this.refreshToken = config.refresh.refreshToken;
      this.refreshTokenExpiresAt = config.refresh.expiresAt;
    }
    this.httpClient = httpClient;
  }

  public async getAccessToken(force = false): Promise<string | null> {
    if (
      this.accessToken != null &&
      Date.now() < this.accessTokenExpiresAt &&
      !force
    ) {
      return this.accessToken;
    }

    if (this.refreshToken != null && Date.now() < this.refreshTokenExpiresAt) {
      return await this.retrieveAccessTokenByRefreshToken(this.refreshToken);
    } else {
      console.error(
        'Refresh Token expired and the access needs to be regranted via manual authorization!'
      );
    }

    return null;
  }

  // https://developers.etsy.com/documentation/tutorials/quickstart#generate-the-pkce-code-challenge
  public generatePKCECodeChallengeUri(): string {
    // Helper functions to generate the code challenge required by Etsy’s OAuth implementation
    const base64URLEncode = (buffer: Buffer): string =>
      buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    const sha256 = (value: string): Buffer =>
      crypto.createHash('sha256').update(value).digest();

    // Generate verifier to base the code challenge on
    const codeVerifier = base64URLEncode(crypto.randomBytes(32));

    // Generate the values needed for OAuth authorization grant
    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    const state = Math.random().toString(36).substring(7);

    // Save verifier for a future step in the OAuth flow
    this.codeVerifiers[state] = codeVerifier;

    // Build URI
    return `${etsyConfig.auth.challengeEndpoint}
    ?response_type=code
    &redirect_uri=${this.config.redirectUrl}
    &scope=${this.config.scopes.join('%20')}
    &client_id=${this.config.clientId}
    &state=${state}
    &code_challenge=${codeChallenge}
    &code_challenge_method=S256`
      .replace(/\s+/g, '')
      .trim();
  }

  public async retrieveAccessTokenByAuthorizationCode(
    code: string,
    state: string
  ): Promise<string | null> {
    try {
      const codeVerifier = this.codeVerifiers[state];
      if (codeVerifier == null) {
        console.error('No matching code verifier found!');
        return null;
      }

      // Prepare body
      const body = {
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUrl,
        code,
        code_verifier: codeVerifier,
      };

      // Send request
      const response = await this.httpClient.post<TEtsyAuthResponseDto>(
        etsyConfig.auth.tokenEndpoint,
        body
      );

      const accessToken = this.handleRetrieveAccessTokenResponse(response.data);

      // Delete code verifier as the code can only be used once
      delete this.codeVerifiers[state];

      return accessToken;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  public async retrieveAccessTokenByRefreshToken(
    refreshToken: string
  ): Promise<string | null> {
    try {
      // Prepare body
      const body = {
        grant_type: 'refresh_token',
        client_id: this.config.clientId,
        refresh_token: refreshToken,
      };

      // Send request
      const response = await this.httpClient.post<TEtsyAuthResponseDto>(
        etsyConfig.auth.tokenEndpoint,
        body
      );

      return this.handleRetrieveAccessTokenResponse(response.data);
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  private handleRetrieveAccessTokenResponse(data: TEtsyAuthResponseDto) {
    if (
      data.access_token == null ||
      data.expires_in == null ||
      data.refresh_token == null
    )
      return null;

    this.accessToken = data.access_token;
    this.accessTokenExpiresAt =
      Date.now() + (data.expires_in - this.accessTokenPuffer) * 1000;
    this.refreshToken = data.refresh_token;
    if (data.refresh_token !== this.refreshToken) {
      this.refreshToken = data.refresh_token;
      this.refreshTokenExpiresAt = Date.now() + 89 * 24 * 60 * 60 * 1000;
    }

    console.log(
      `Successfully retrieved new Etsy Access Token that will expire at ${new Date(
        this.accessTokenExpiresAt
      ).toLocaleTimeString()}`
    );

    return this.accessToken;
  }
}

type TOAuth2Config = {
  clientId: string;
  redirectUrl: string;
  scopes: string[];
  refresh?: {
    refreshToken: string;
    expiresAt: number;
  };
};
