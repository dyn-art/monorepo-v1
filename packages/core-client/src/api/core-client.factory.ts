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
    requestMiddleware.push(async (data) => {
      const { requestInit } = data;
      const newHeaders = { ...(requestInit.headers ?? {}) };
      newHeaders['X-CORS-API-KEY'] = corsApiKey;
      return { requestInit: { ...requestInit, headers: newHeaders } };
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
