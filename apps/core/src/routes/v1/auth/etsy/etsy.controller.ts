import express from 'express';
import { etsyClient } from '../../../../core';
import { AppError } from '../../../../middlewares';

export async function getPing(req: express.Request, res: express.Response) {
  const success = await etsyClient.ping();
  res.send(success);
}

export async function getOAuthChallenge(
  req: express.Request,
  res: express.Response
) {
  const success = await etsyClient.ping();
  if (!success) {
    throw new AppError(
      500,
      'Failed to communicate with Etsy API! Either Etsy can not be reached or the App Credentials are not valid!'
    );
  }
  const challenge = etsyClient.authService.generatePKCECodeChallengeUri();
  res.send(challenge);
}

export async function handleOAuthRedirect(
  req: express.Request,
  res: express.Response
) {
  const { code, state, error, error_description } = req.query;

  // Handle error response
  if (error != null && error_description != null) {
    res.send({
      error,
      error_description,
    });
    return;
  }

  // Handle no code or state present
  if (typeof code !== 'string' || typeof state !== 'string') {
    throw new AppError(500, 'No valid code or/and state provided');
  }

  // Token exchange
  const tokens = await etsyClient.authService.retrieveTokensByAuthorizationCode(
    code,
    state
  );

  res.send({ tokens, success: tokens != null });
}
