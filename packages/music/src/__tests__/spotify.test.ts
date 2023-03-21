import { OAuth2Service, SpotifyClient, SpotifyService } from '../spotify';

describe('spotify tests', () => {
  it('send request to spotify api', async () => {
    const authService = new OAuth2Service({
      clientId: process.env.SPOTIFY_CLIENT_ID || 'unknown',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'unknown',
    });
    const spotifyClient = new SpotifyClient(authService);
    const spotifyService = new SpotifyService(spotifyClient);

    const response = await spotifyService.searchTrackByName('Jeff');
    console.log(response);

    expect(response).not.toBeNull();
  });
});
