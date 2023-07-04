import { etsyAuthService, etsyService } from '@/core/services';
import { AppError } from '@/middlewares';
import { TRequestController } from '@/types';
import { query } from 'express-validator';

export const getPing: TRequestController<'/v1/auth/etsy/ping', 'get'> = async (
  req,
  res
) => {
  const success = await etsyService.ping();
  res.status(200).send(success);
};

export const getOAuthChallenge: TRequestController<
  '/v1/auth/etsy/oauth/challenge',
  'get'
> = async (req, res) => {
  // Check whether Etsy can be reached
  const success = await etsyService.ping();
  if (!success) {
    throw new AppError(500, '#ERR_ETSY_PING', {
      description:
        'Failed to communicate with Etsy API! Either Etsy can not be reached or the App Credentials are not valid!',
    });
  }

  // Generate PKCE Code Challenge
  const challenge = etsyAuthService.generatePKCECodeChallengeUri();

  res.status(200).send({ challenge });
};

export const handleOAuthRedirect: TRequestController<
  '/v1/auth/etsy/oauth/redirect',
  'get'
> = [
  async (req, res) => {
    const { code, state, error, error_description } = req.query;

    // Handle error parameters
    if (error != null && error_description != null) {
      throw new AppError(500, error, { description: error_description });
    }

    // Validate query parameters
    else if (code != null && state != null) {
      // Token exchange
      const accessToken =
        await etsyAuthService.retrieveAccessTokenByAuthorizationCode(
          code,
          state
        );
      const refreshTokenInfo = etsyAuthService.getRefreshTokenInfo();
      if (
        refreshTokenInfo.refreshToken == null ||
        refreshTokenInfo.expiresAt == null
      ) {
        throw new AppError(500, '#ERR_RESOLVE_REFRESH_TOKEN', {
          description: 'Failed to resolve refresh token!',
        });
      }

      res.status(200).send({
        access_token: accessToken,
        refresh_token: refreshTokenInfo.refreshToken,
        refresh_token_expires_at: refreshTokenInfo.expiresAt,
      });
    }

    throw new AppError(400, '#ERR_BAD_REQUEST', {
      description: 'No valid query parameters present!',
    });
  },
  [
    query('code').optional().isString(),
    query('state').optional().isString(),
    query('error').optional().isString(),
    query('error_description').optional().isString(),
  ],
];
