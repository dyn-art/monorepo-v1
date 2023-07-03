import { OAuth2Service, TOAuth2Config, createEtsyClient } from '../api';
import { EtsyService } from './EtsyService';

export function createEtsyService(authConfig: TOAuth2Config) {
  const oAuth2Service = new OAuth2Service(authConfig);
  const client = createEtsyClient(oAuth2Service);
  return new EtsyService(client);
}
