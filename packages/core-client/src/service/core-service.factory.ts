import { TCoreClientOptions, createCoreClient } from '../api';
import { CoreService } from './CoreService';

export function createCoreService(options: TCoreClientOptions) {
  const client = createCoreClient(options);
  return new CoreService(client);
}
