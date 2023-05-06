export type TAuthResponseDto = {
  access_token?: string;
  expires_in?: number;
};

export type TSearchResponseDto = SpotifyApi.SearchResponse;
export type TSearchForItemParameterDto =
  SpotifyApi.SearchForItemParameterObject;

export type TGetTrackResponseDto = SpotifyApi.TrackObjectFull;
