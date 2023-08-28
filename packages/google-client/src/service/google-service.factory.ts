import { TGoogleClientOptions, createGoogleClient } from '../api';
import { GoogleService } from './GoogleService';

export function createGoogleService(options: TGoogleClientOptions = {}) {
  const client = createGoogleClient(options);
  return new GoogleService(client);
}
