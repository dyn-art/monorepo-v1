import { createCoreService } from '@pda/core-client';
import { RawFetchClientThrow } from '@pda/openapi-fetch';

export const coreService = createCoreService();
export const fetchClient = new RawFetchClientThrow();
