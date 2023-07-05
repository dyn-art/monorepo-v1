import {
  OpenAPIFetchClientThrow,
  TRequestMiddleware,
} from '@pda/openapi-fetch';
import { paths } from '@pda/types/core';
import { coreConfig } from '../environment';

export function createCoreClient(
  options: TCoreClientOptions = {}
): OpenAPIFetchClientThrow<paths> {
  const { baseUrl = coreConfig.baseUrl, corsApiKey = coreConfig.corsApiKey } =
    options;
  const requestMiddleware: TRequestMiddleware[] = [];
  if (corsApiKey != null) {
    requestMiddleware.push(async (requestInit) => {
      const { headers = {} } = requestInit;
      const newHeaders = { ...headers };
      newHeaders['X-CORS-API-KEY'] = corsApiKey;
      return { ...requestInit, headers: newHeaders };
    });
  }
  return new OpenAPIFetchClientThrow<paths>(baseUrl, {
    requestMiddleware,
  });
}

export type TCoreClientOptions = {
  baseUrl?: string;
  corsApiKey?: string;
};
