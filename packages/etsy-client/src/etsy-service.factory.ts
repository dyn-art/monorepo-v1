import { EtsyService } from './EtsyService';
import { EtsyClient, OAuth2Service } from './api';
import { TOAuth2Config } from './types';

export function createEtsyService(authConfig: TOAuth2Config) {
  const oAuth2Service = new OAuth2Service(authConfig);
  const etsyClient = new EtsyClient(oAuth2Service);
  return new EtsyService(etsyClient);
}
