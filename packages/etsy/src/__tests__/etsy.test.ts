import { EtsyClient } from '../EtsyClient';
import { OAuth2Service } from '../OAuth2Service';

describe('etsy tests', () => {
  it('send request to etsy api', async () => {
    const authService = new OAuth2Service({
      clientId: process.env.ETSY_KEY_STRING || 'unknown',
      scopes: ['email_r', 'transactions_r', 'transactions_w', 'shops_r'],
      redirectUrl: 'http://localhost:8080',
    });
    const etsyClient = new EtsyClient(authService);

    const success = await etsyClient.ping();
    expect(success).toBe(true);
  });
});
