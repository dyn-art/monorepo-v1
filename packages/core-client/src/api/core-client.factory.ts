import { OpenAPIFetchClientThrow } from '@pda/openapi-fetch';
import { paths } from '@pda/types/core';
import { coreConfig } from '../environment';

export function createCoreClient(): OpenAPIFetchClientThrow<paths> {
  return new OpenAPIFetchClientThrow<paths>(coreConfig.baseUrl);
}
