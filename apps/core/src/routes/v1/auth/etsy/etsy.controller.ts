import express from 'express';
import { query } from 'express-validator';
import { etsyClient } from '../../../../core/services';
import { AppError } from '../../../../middlewares';

export async function getPing(req: express.Request, res: express.Response) {
  const success = await etsyClient.ping();
  res.status(200).send(success);
}

export async function getOAuthChallenge(
  req: express.Request,
  res: express.Response
) {
  // Check whether Etsy can be reached
  const success = await etsyClient.ping();
  if (!success) {
    throw new AppError(
      500,
      'Failed to communicate with Etsy API! Either Etsy can not be reached or the App Credentials are not valid!'
    );
  }

  // Generate PKCE Code Challenge
  const challenge = etsyClient.authService.generatePKCECodeChallengeUri();

  res.status(200).send(challenge);
}

export async function handleOAuthRedirect(
  req: express.Request<
    {},
    {},
    {},
    {
      code?: string;
      state?: string;
      error?: string;
      error_description?: string;
    }
  >,
  res: express.Response
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

    res.status(200).send({
      accessToken,
      refreshToken: refreshTokenInfo.refreshToken,
      refreshTokenExpiresAt: refreshTokenInfo.expiresAt,
    });
  }

  throw new AppError(500, 'No query parameter code and state present!');
}

handleOAuthRedirect.validator = [
  query('code').optional().isString(),
  query('state').optional().isString(),
  query('error').optional().isString(),
  query('error_description').optional().isString(),
];
