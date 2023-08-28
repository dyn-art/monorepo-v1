import { describe, expect, it } from 'vitest';
import { createCoreService } from '../service';

describe('core tests', () => {
  it('send request to core api', async () => {
    // Given
    const coreService = createCoreService();

    // When
    const response = await coreService.downloadWebFontWOFF2File('Roboto');
    // const response = await coreService.getPreSignedUploadUrl(
    //   'test',
    //   'public:readonly',
    //   'application/json'
    // );

    // Then
    expect(response).not.toBeNull();
  });
});
