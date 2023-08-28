import { OpenAPIFetchClient } from '@dyn/openapi-fetch';
import { googleConfig } from '../environment';
import { paths } from '../gen/webfonts-v1';

export function createGoogleClient(
  options: TGoogleClientOptions = {}
): OpenAPIFetchClient<paths> {
  const { baseUrl = googleConfig.baseUrl, apiKey = googleConfig.auth.apiKey } =
    options;
  return new OpenAPIFetchClient<paths>(baseUrl, {
    requestMiddleware: [
      async (data) => {
        const { queryParams } = data;
        const newQueryParams = queryParams ?? {};
        newQueryParams['key'] = apiKey;
        return { queryParams: newQueryParams };
      },
    ],
  });
}

export type TGoogleClientOptions = {
  baseUrl?: string;
  apiKey?: string;
};
