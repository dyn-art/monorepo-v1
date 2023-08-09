import { createGoogleService } from '../service';

describe('google tests', () => {
  it('send request to google fonts api', async () => {
    const googleService = createGoogleService({
      apiKey: process.env.GOOGLE_API_KEY || 'not-set',
    });

    const response = await googleService.getFontFileURL('Roboto Serif', {
      fontWeight: 100,
      fontStyle: 'italic',
    });

    expect(response).not.toBeNull();
  });
});
