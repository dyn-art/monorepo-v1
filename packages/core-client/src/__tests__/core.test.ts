import { CoreClient } from '../api/CoreClient';

describe('core tests', () => {
  it('send request to core api', async () => {
    const coreClient = new CoreClient();

    const response = await coreClient.getPreSignedUploadUrl('jeff');

    expect(response).not.toBeNull();
  });
});
