import { OAuth2Service, SpotifyClient, SpotifyService } from '../spotify';

describe('spotify tests', () => {
  it('send request to spotify api', async () => {
    const authService = new OAuth2Service({
      clientId: process.env.SPOTIFY_CLIENT_ID || 'unknown',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'unknown',
    });
    const spotifyClient = new SpotifyClient(authService);
    const spotifyService = new SpotifyService(spotifyClient);

    const searchResult = await spotifyService.searchTrackByName(
      'For The People',
      'Mike Candys'
    );
    const tracks = searchResult?.tracks?.items;
    console.log(searchResult);
    if (tracks != null && tracks.length > 0) {
      const track = await spotifyService.getTrackById(tracks[0].id);
      console.log(track);
    }

    expect(searchResult).not.toBeNull();
  });
});
