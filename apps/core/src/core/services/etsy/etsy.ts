import { EtsyClient, EtsyService, OAuth2Service } from '@pda/etsy';
import { etsyConfig } from '../../../environment';

const authService = new OAuth2Service({
  clientId: etsyConfig.auth.clientId,
  scopes: etsyConfig.auth.scopes,
  redirectUrl: etsyConfig.auth.redirectUrl,
  refresh: {
    refreshToken: etsyConfig.auth.refreshToken,
    expiresAt: etsyConfig.auth.refreshTokenExpiresAt,
  },
});
export const etsyClient = new EtsyClient(authService);
export const etsyService = new EtsyService(etsyClient);
