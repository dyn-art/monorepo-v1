import appConfig from './app.config';

const appName = process.env.ETSY_APP_NAME ?? 'unknown';
const clientId = process.env.ETSY_KEY_STRING ?? 'unknown';
const sharedSecret = process.env.ETSY_SHARED_SECRET ?? 'unknown';

export default {
  appName,
  auth: {
    clientId,
    sharedSecret,
    redirectUrl: `${appConfig.baseUrl}/auth/etsy/oauth/redirect`,
    scopes: ['email_r', 'transactions_r', 'transactions_w', 'shops_r'],
  },
};
