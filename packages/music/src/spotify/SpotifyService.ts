import { SpotifyClient } from './SpotifyClient';

export class SpotifyService {
  private readonly _spotifyClient: SpotifyClient;

  constructor(spotifyClient: SpotifyClient) {
    this._spotifyClient = spotifyClient;
  }

  public searchTrackByName(trackKeyword: string, artistKeyword?: string) {
    const query = `track:${trackKeyword}${
      artistKeyword != null ? ` artist:${artistKeyword}` : ''
    }`;
    return this._spotifyClient.search({ query, type: 'track' });
  }

  public getTrackById(trackId: string) {
    return this._spotifyClient.getTrack(trackId);
  }
}
