import { createCoreService } from '../service';

describe('core tests', () => {
  it('send request to core api', async () => {
    // Given
    const coreService = createCoreService();

    // When
    const response = await coreService.downloadJsonFromS3(
      '0989cce5edf8af5698ced8e06a9daa2924620f03b0601cd3c4914ea1e3fd64a6'
    );
    // const response = await coreService.getPreSignedUploadUrl(
    //   'test',
    //   'public:readonly',
    //   'application/json'
    // );

    // Then
    expect(response).not.toBeNull();
  });
});
