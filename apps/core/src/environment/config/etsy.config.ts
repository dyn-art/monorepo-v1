import appConfig from './app.config';

const appName = process.env.ETSY_APP_NAME ?? 'not-set';
const clientId = process.env.ETSY_KEY_STRING ?? 'not-set';
const sharedSecret = process.env.ETSY_SHARED_SECRET ?? 'not-set';
const refreshToken = process.env.ETSY_REFRESH_TOKEN ?? 'not-set';
const refreshTokenExpiresAt = process.env.ETSY_REFRESH_TOKEN_EXPIRES_AT;

export default {
  appName,
  auth: {
    clientId,
    sharedSecret,
    redirectUrl: `${appConfig.baseUrl}/auth/etsy/oauth/redirect`,
    scopes: ['email_r', 'transactions_r', 'transactions_w', 'shops_r'],
    refreshToken,
    refreshTokenExpiresAt: refreshTokenExpiresAt ? +refreshTokenExpiresAt : 0,
  },
};
