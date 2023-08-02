import { createCoreService } from '@pda/core-client';
import { createGoogleService } from '@pda/google-client';
import { RawFetchClientThrow } from '@pda/openapi-fetch';

export const coreService = createCoreService();
export const googleService = createGoogleService();
export const fetchClient = new RawFetchClientThrow();
