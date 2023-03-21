import { SpotifyClient } from './SpotifyClient';

export class SpotifyService {
  private readonly spotifyClient: SpotifyClient;

  constructor(spotifyClient: SpotifyClient) {
    this.spotifyClient = spotifyClient;
  }

  public searchTrackByName(trackKeyword: string, artistKeyword?: string) {
    const query = `track:${trackKeyword}${
      artistKeyword != null ? ` artist:${artistKeyword}` : ''
    }`;
    return this.spotifyClient.search({ query, type: 'track' });
  }
}
