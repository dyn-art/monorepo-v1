import { etsyConfig } from '@/environment';
import { EtsyService, OAuth2Service, createEtsyClient } from '@dyn/etsy-client';

export const etsyAuthService = new OAuth2Service({
  clientId: etsyConfig.auth.clientId,
  scopes: etsyConfig.auth.scopes,
  redirectUrl: etsyConfig.auth.redirectUrl,
  refresh: {
    refreshToken: etsyConfig.auth.refreshToken,
    expiresAt: etsyConfig.auth.refreshTokenExpiresAt,
  },
});
export const etsyService = new EtsyService(createEtsyClient(etsyAuthService));
