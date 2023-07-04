import { OpenAPIFetchClient } from '../OpenAPIFetchClient';
import { paths } from './resources/mock-openapi-types';

describe('OpenAPIFetch class tests', () => {
  it('should work', () => {
    const client = new OpenAPIFetchClient<paths>('some-base-url');

    client.get('/v1/ping', {
      pathParams: { test: 123 },
    });

    client.post(
      '/v1/ping',
      { hello: 'jeff', jeff: 123 },
      {
        pathParams: { shop_id: 123 },
      }
    );
    client.fetch('/v1/ping', 'POST', {
      pathParams: { shop_id: 123 },
      body: { hello: 'jeff', jeff: 123 },
    });
    client.fetch('/v1/auth/etsy/oauth/challenge', 'GET', {
      body: { test: 123 },
    });
  });
});
