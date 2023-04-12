import { EtsyClient } from '../EtsyClient';
import { EtsyService } from '../EtsyService';
import { OAuth2Service } from '../OAuth2Service';

describe('etsy tests', () => {
  it('send request to etsy api', async () => {
    const authService = new OAuth2Service({
      clientId: process.env.ETSY_KEY_STRING || 'not-set',
      scopes: ['email_r', 'transactions_r', 'transactions_w', 'shops_r'],
      redirectUrl: 'http://localhost:8080',
      refresh: {
        refreshToken: process.env.ETSY_REFRESH_TOKEN || 'not-set',
        expiresAt: +(process.env.ETSY_REFRESH_TOKEN_EXPIRES_AT || 0),
      },
    });
    const etsyClient = new EtsyClient(authService);
    const etsyService = new EtsyService(etsyClient);

    const success = await etsyClient.ping();
    const shopReceipts = await etsyService.getShopReceipts();

    expect(success).toBe(true);
    expect(shopReceipts).not.toBeNull();
  });
});
