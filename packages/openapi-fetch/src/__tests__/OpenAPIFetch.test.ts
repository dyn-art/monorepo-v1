import { OpenAPIFetchClient, RawFetchClient } from '../clients';
import { isRequestException } from '../utils';
import { paths } from './resources/mock-openapi-types';

describe('OpenAPIFetch class tests', () => {
  it('should work', async () => {
    const client = new OpenAPIFetchClient<paths>('some-base-url', {});
    const rawClient = new RawFetchClient('some-base-url');
    rawClient.get('test');

    const test = await rawClient.get('test', {
      parseAs: 'blob',
    });
    if (!test.isError) {
      const jeff = test.data;
    }

    const response = await client.get(
      '/v1/media/pre-signed-download-url/{key}',
      {
        pathParams: {
          key: 'test',
        },
        bodySerializer: (body) => {
          return '';
        },
        querySerializer: (query) => {
          return '';
        },
        parseAs: 'arrayBuffer',
      }
    );

    if (response.isError) {
      const error = response.error;
      if (isRequestException(error)) {
        const data = error.data;
      }
    } else {
      const data = response.data;
    }

    client.get('/v1/ping', {
      pathParams: { test: 123 },
      queryParams: { test: 123 },
    });

    await client.post(
      '/v1/ping',
      { hello: 'jeff', jeff: 123 },
      {
        pathParams: { shop_id: 123 },
        queryParams: { shop_id: 123 },
        bodySerializer: (body) => {
          return '';
        },
        querySerializer: (query) => {
          return '';
        },
      }
    );

    client.fetch('/v1/ping', 'POST', {
      pathParams: { shop_id: 123 },
      queryParams: { shop_id: 123 },
      body: { hello: 'jeff', jeff: 123 },
    });
    client.fetch('/v1/auth/etsy/oauth/challenge', 'GET', {
      body: { test: 123 },
    });
  });
});
