import { OAuth2Service } from '../OAuth2Service';
import { SpotifyClient } from '../SpotifyClient';
import { SpotifyService } from '../SpotifyService';

describe('spotify tests', () => {
  it('send request to spotify api', async () => {
    const authService = new OAuth2Service({
      clientId: process.env.SPOTIFY_CLIENT_ID || 'not-set',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'not-set',
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
