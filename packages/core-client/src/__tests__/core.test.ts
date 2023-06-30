import { createCoreService } from '../core-service.factory';

describe('core tests', () => {
  it('send request to core api', async () => {
    // Given
    const coreService = createCoreService();

    // When
    const response = await coreService.downloadJsonFromS3(
      '546fc1fcdc58c1d2ae18d1575c11345f93c6a5d6e23b6f1e6d844afc9f763e5e'
    );

    // Then
    expect(response).not.toBeNull();
  });
});
