import { createCoreClient } from '../api';
import { CoreService } from './CoreService';

export function createCoreService() {
  const client = createCoreClient();
  return new CoreService(client);
}
