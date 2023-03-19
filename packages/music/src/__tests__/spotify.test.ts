import { OAuth2Service, SpotifyClient } from '../spotify';

describe('spotify tests', () => {
  it('send request to spotify api', async () => {
    const authService = new OAuth2Service({
      clientId: 'jeff',
      clientSecret: 'jeff',
    });
    const spotifyClient = new SpotifyClient(authService);

    const response = await spotifyClient.search({
      params: {
        q: 'trak:Jeff',
        type: 'track',
      },
    });
    console.log(response);

    expect(response).not.toBeNull();
  });
});
