import { EtsyClient, OAuth2Service } from '@pda/etsy';
import { etsyConfig } from '../../environment';

const authService = new OAuth2Service({
  clientId: etsyConfig.auth.clientId,
  scopes: etsyConfig.auth.scopes,
  redirectUrl: etsyConfig.auth.redirectUrl,
});
export const etsyClient = new EtsyClient(authService);
