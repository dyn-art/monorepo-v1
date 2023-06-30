import { CoreService } from './CoreService';
import { CoreClient } from './api';

export function createCoreService() {
  const coreClient = new CoreClient();
  return new CoreService(coreClient);
}
