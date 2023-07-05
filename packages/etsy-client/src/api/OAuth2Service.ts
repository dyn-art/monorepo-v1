import { RawFetchClient } from '@pda/openapi-fetch';
import crypto from 'crypto';
import { etsyConfig } from '../environment';
import {
  RefreshTokenExpiredException,
  RetrieveAccessTokenException,
} from '../exceptions';
import { logger } from '../logger';

export class OAuth2Service {
  public readonly _config: Omit<TOAuth2Config, 'refresh'>;
  public readonly _client: RawFetchClient;

  private readonly _codeVerifiers: Record<string, string> = {};

  private _accessToken: string | null = null;
  private _accessTokenExpiresAt: number | null = null;
  private readonly _accessTokenBuffer = 60 * 5; // 5 min

  private _refreshToken: string | null = null; // 90 day life span
  private _refreshTokenExpiresAt: number | null = null;

  constructor(config: TOAuth2Config) {
    this._config = {
      clientId: config.clientId,
      redirectUrl: config.redirectUrl,
      scopes: config.scopes,
    };
    this._client = new RawFetchClient();
    if (config.refresh != null) {
      const { refreshToken, expiresAt } = config.refresh;
      this._refreshToken = refreshToken;
      this._refreshTokenExpiresAt = expiresAt;
    }
  }

  public async getAccessToken(force = false): Promise<string> {
    // Check whether access token is cached and not expired
    if (
      this._accessToken != null &&
      this._accessTokenExpiresAt != null &&
      Date.now() < this._accessTokenExpiresAt &&
      !force
    ) {
      return this._accessToken;
    }

    // Check whether refresh token is expired
    if (
      this._refreshToken == null ||
      this._refreshTokenExpiresAt == null ||
      Date.now() > this._refreshTokenExpiresAt
    ) {
      throw new RefreshTokenExpiredException('#ERR_REFRESH_TOKEN_EXPIRED', {
        description:
          'Refresh Token expired and the access needs to be re-granted by manual authorization!',
      });
    }

    // Retrieve new access token by refresh token
    return this.retrieveAccessTokenByRefreshToken(this._refreshToken);
  }

  public getRefreshTokenInfo() {
    return {
      refreshToken: this._refreshToken,
      expiresAt: this._refreshTokenExpiresAt,
    };
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
    this._codeVerifiers[state] = codeVerifier;

    // Build URI
    return `${etsyConfig.auth.challengeEndpoint}
    ?response_type=code
    &redirect_uri=${this._config.redirectUrl}
    &scope=${this._config.scopes.join('%20')}
    &client_id=${this._config.clientId}
    &state=${state}
    &code_challenge=${codeChallenge}
    &code_challenge_method=S256`
      .replace(/\s+/g, '')
      .trim();
  }

  public async retrieveAccessTokenByAuthorizationCode(
    code: string,
    state: string
  ): Promise<string> {
    const codeVerifier = this._codeVerifiers[state];
    if (codeVerifier == null) {
      throw new RetrieveAccessTokenException('#ERR_NO_MATCHING_CODE_VERIFIER', {
        description: `No matching code verifier found for state '${state}'!`,
      });
    }

    // Prepare body
    const body: TPost_OAuthToken_BodyDTO = {
      grant_type: 'authorization_code',
      client_id: this._config.clientId,
      redirect_uri: this._config.redirectUrl,
      code,
      code_verifier: codeVerifier,
    };

    // Send request
    let data: TPost_OAuthToken_ResponseDTO;
    const response = await this._client.rawPost<TPost_OAuthToken_ResponseDTO>(
      etsyConfig.auth.tokenEndpoint,
      body
    );
    if (response.isError) {
      throw response.error;
    } else {
      data = response.data;
    }

    // Delete code verifier as the code can only be used once
    delete this._codeVerifiers[state];

    // Handle response data
    return this.handleRetrieveAccessTokenResponseData(data);
  }

  public async retrieveAccessTokenByRefreshToken(
    refreshToken: string
  ): Promise<string> {
    // Prepare body
    const body: TPost_OAuthToken_BodyDTO = {
      grant_type: 'refresh_token',
      client_id: this._config.clientId,
      refresh_token: refreshToken,
    };

    // Send request
    let data: TPost_OAuthToken_ResponseDTO;
    const response = await this._client.rawPost<TPost_OAuthToken_ResponseDTO>(
      etsyConfig.auth.tokenEndpoint,
      body
    );
    if (response.isError) {
      throw response.error;
    } else {
      data = response.data;
    }

    // Handle response data
    return this.handleRetrieveAccessTokenResponseData(data);
  }

  // ============================================================================
  // Helper
  // ============================================================================

  private handleRetrieveAccessTokenResponseData(
    data: TPost_OAuthToken_ResponseDTO
  ) {
    if (data.access_token == null || data.expires_in == null) {
      throw new RetrieveAccessTokenException('#ERR_RETRIEVE_ACCESS_TOKEN', {
        description: `Invalid response DTO! Either 'access_token' or 'expires_in' is missing.`,
      });
    }

    // Update access token
    this._accessToken = data.access_token;
    this._accessTokenExpiresAt =
      Date.now() + (data.expires_in - this._accessTokenBuffer) * 1000;

    // Update refresh token if changed
    if (data.refresh_token !== this._refreshToken) {
      this._refreshToken = data.refresh_token;
      this._refreshTokenExpiresAt = Date.now() + (90 - 5) * 24 * 60 * 60 * 1000; // 90 days - 5 days as buffer
    }

    logger.info(
      `Successfully retrieved new Etsy access token that expires at: ${new Date(
        this._accessTokenExpiresAt
      ).toLocaleTimeString()}`
    );

    return this._accessToken;
  }
}

export type TOAuth2Config = {
  clientId: string;
  redirectUrl: string;
  scopes: string[];
  refresh?: {
    refreshToken: string;
    expiresAt: number;
  };
};

export type TPost_OAuthToken_ResponseDTO = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
};

export type TPost_OAuthToken_BodyDTO =
  | TPost_OAuthTokenRefreshToken_BodyDTO
  | TPost_OAuthTokenAuthorizationCode_BodyDTO;

export type TPost_OAuthTokenRefreshToken_BodyDTO = {
  grant_type: 'refresh_token';
  client_id: string;
  refresh_token: string;
};

export type TPost_OAuthTokenAuthorizationCode_BodyDTO = {
  grant_type: 'authorization_code';
  client_id: string;
  redirect_uri: string;
  code: string;
  code_verifier: string;
};
