const baseUrl = process.env.ETSY_BASE_URL ?? 'https://openapi.etsy.com';
const authTokenEndpoint =
  process.env.ETSY_AUTH_TOKEN_ENDPOINT ??
  'https://api.etsy.com/v3/public/oauth/token';
const authChallengeEndpoint =
  process.env.ETSY_AUTH_CHALLENGE_ENDPOINT ??
  'https://www.etsy.com/oauth/connect';

export default {
  auth: {
    tokenEndpoint: authTokenEndpoint,
    challengeEndpoint: authChallengeEndpoint,
  },
  baseUrl,
};
