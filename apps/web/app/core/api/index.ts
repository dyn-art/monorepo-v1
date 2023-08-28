import { createCoreService } from '@dyn/core-client';
import { RawFetchClientThrow } from '@dyn/openapi-fetch';

export const coreService = createCoreService();
export const fetchClient = new RawFetchClientThrow();
