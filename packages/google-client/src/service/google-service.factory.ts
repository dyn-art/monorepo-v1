import {
  TGoogleClientOptions as TGoogleClientConfig,
  createGoogleClient,
} from '../api';
import { GoogleService } from './GoogleService';

export function createGoogleService(config: TGoogleClientConfig) {
  const client = createGoogleClient(config);
  return new GoogleService(client);
}
