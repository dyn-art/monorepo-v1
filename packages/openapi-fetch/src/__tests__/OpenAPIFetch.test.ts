import { OpenAPIFetchClient } from '../OpenAPIFetchClient';
import { paths } from './resources/mock-openapi-types';

describe('OpenAPIFetch class tests', () => {
  it('should work', () => {
    const client = new OpenAPIFetchClient<paths>('some-base-url');
    client.get('/v1/media/pre-signed-download-url/{key}', {
      pathParams: {
        key: 'jeff',
      },
    });

    client.get('/v1/ping', {
      pathParams: { test: 123 },
      queryParams: { test: 123 },
    });

    client.post(
      '/v1/ping',
      { hello: 'jeff', jeff: 123 },
      { pathParams: { shop_id: 123 } }
    );

    client.fetch('/v1/ping', 'POST', {
      body: {
        hello: 'test',
      },
      pathParams: { shop_id: 123, test: '' },
    });

    client.fetch('/v1/auth/etsy/oauth/challenge', 'GET', {});
  });
});
