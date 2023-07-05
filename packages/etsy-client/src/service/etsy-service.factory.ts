import {
  OAuth2Service,
  TEtsyClientOptions,
  TOAuth2Config,
  createEtsyClient,
} from '../api';
import { EtsyService } from './EtsyService';

export function createEtsyService(
  config: TEtsyClientOptions & { auth: TOAuth2Config }
) {
  const oAuth2Service = new OAuth2Service(config.auth);
  const client = createEtsyClient(oAuth2Service, config);
  return new EtsyService(client);
}
