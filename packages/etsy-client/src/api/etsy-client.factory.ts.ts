import { OpenAPIFetchClient } from '@pda/openapi-fetch';
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
      async (requestInit, props) => {
        const { headers = {} } = requestInit;
        const newHeaders = { ...headers };
        newHeaders['x-api-key'] = authService._config.clientId;
        if (!props.noAuth) {
          const token = await authService.getAccessToken();
          if (token != null) {
            newHeaders['Authorization'] = `Bearer ${token}`;
          }
        }
        return { ...requestInit, headers: newHeaders };
      },
    ],
  });
}

export type TEtsyClientOptions = {
  baseUrl?: string;
};
