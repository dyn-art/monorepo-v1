import { OpenAPIFetchClient } from '@dyn/openapi-fetch';
import { etsyConfig } from '../environment';
import { paths } from '../gen/v3';
import { OAuth2Service } from './OAuth2Service';

export function createEtsyClient(
  authService: OAuth2Service,
  options: TEtsyClientOptions = {}
): OpenAPIFetchClient<paths> {
  const { baseUrl = etsyConfig.baseUrl } = options;
  return new OpenAPIFetchClient<paths>(baseUrl, {
    requestMiddleware: [
      // Authorization headers middleware
      async (data) => {
        const { requestInit, props } = data;
        const { headers = {} } = requestInit;
        const newHeaders = { ...headers };
        newHeaders['x-api-key'] = authService._config.clientId;
        if (!props.noAuth) {
          const token = await authService.getAccessToken();
          if (token != null) {
            newHeaders['Authorization'] = `Bearer ${token}`;
          }
        }
        requestInit['headers'] = newHeaders;
        return { requestInit };
      },
    ],
  });
}

export type TEtsyClientOptions = {
  baseUrl?: string;
};
