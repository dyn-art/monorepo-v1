import { createEtsyService } from '../service/etsy-service.factory';

describe('etsy tests', () => {
  it('send request to etsy api', async () => {
    const etsyService = createEtsyService({
      clientId: process.env.ETSY_KEY_STRING || 'not-set',
      scopes: ['email_r', 'transactions_r', 'transactions_w', 'shops_r'],
      redirectUrl: 'http://localhost:8080',
      refresh: {
        refreshToken: process.env.ETSY_REFRESH_TOKEN || 'not-set',
        expiresAt: +(process.env.ETSY_REFRESH_TOKEN_EXPIRES_AT || 0),
      },
    });

    const success = await etsyService.ping();
    const shopReceipts = await etsyService.getShopReceipts();

    expect(success).toBe(true);
    expect(shopReceipts).not.toBeNull();
  });
});
