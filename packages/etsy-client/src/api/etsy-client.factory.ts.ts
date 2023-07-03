import { RequestClient } from '@pda/client-utils';
import { etsyConfig } from '../environment';
import { paths } from '../gen/v3';
import { OAuth2Service } from './OAuth2Service';

export function createEtsyClient(
  authService: OAuth2Service
): RequestClient<paths> {
  const client = new RequestClient<paths>(etsyConfig.baseUrl, {
    requestMiddleware: [
      // Authorization headers middleware
      async (requestInit, props) => {
        const { headers = {} } = requestInit;
        const newHeaders = new Headers(headers);
        newHeaders.append('x-api-key', authService._config.clientId);
        if (!props.noAuth) {
          const token = await authService.getAccessToken();
          if (token != null) {
            newHeaders.append('Authorization', `Bearer ${token}`);
          }
        }
        return { ...requestInit, headers: newHeaders };
      },
    ],
  });

  return client;
}
