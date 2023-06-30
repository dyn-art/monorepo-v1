import {
  TGet_Auth_Etsy_GetPing_ResponseDTO,
  TGet_Auth_Etsy_OAuthChallenge_ResponseDTO,
  TGet_Auth_Etsy_OAuthRedirect_QueryParamsDTO,
  TGet_Auth_Etsy_OAuthRedirect_ResponseDTO,
} from '@pda/core-types';
import express from 'express';
import { query } from 'express-validator';
import { etsyClient } from '../../../../core/services';
import { AppError } from '../../../../middlewares';

export async function getPing(
  req: express.Request,
  res: express.Response<TGet_Auth_Etsy_GetPing_ResponseDTO>
) {
  const success = await etsyClient.ping();
  res.status(200).send(success);
}

export async function getOAuthChallenge(
  req: express.Request,
  res: express.Response<TGet_Auth_Etsy_OAuthChallenge_ResponseDTO>
) {
  // Check whether Etsy can be reached
  const success = await etsyClient.ping();
  if (!success) {
    throw new AppError(500, '#ERR_PING', {
      description:
        'Failed to communicate with Etsy API! Either Etsy can not be reached or the App Credentials are not valid!',
    });
  }

  // Generate PKCE Code Challenge
  const challenge = etsyClient.authService.generatePKCECodeChallengeUri();

  res.status(200).send({ challenge });
}

export async function handleOAuthRedirect(
  req: express.Request<{}, {}, {}, TGet_Auth_Etsy_OAuthRedirect_QueryParamsDTO>,
  res: express.Response<TGet_Auth_Etsy_OAuthRedirect_ResponseDTO>
) {
  const { code, state, error, error_description } = req.query;

  // Handle error parameters
  if (error != null && error_description != null) {
    throw new AppError(500, error, { description: error_description });
  }

  // Validate query parameters
  else if (code != null && state != null) {
    // Token exchange
    const accessToken =
      await etsyClient.authService.retrieveAccessTokenByAuthorizationCode(
        code,
        state
      );
    const refreshTokenInfo = etsyClient.authService.getRefreshTokenInfo();
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
}

handleOAuthRedirect.validator = [
  query('code').optional().isString(),
  query('state').optional().isString(),
  query('error').optional().isString(),
  query('error_description').optional().isString(),
];
