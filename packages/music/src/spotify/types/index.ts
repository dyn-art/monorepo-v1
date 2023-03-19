export type TSpotifyAuthResponseDto = {
  access_token?: string;
  expires_in?: number;
};

export type TSpotifySearchResponseDto = SpotifyApi.SearchResponse;
export type TSpotifySearchForItemParameterDto =
  SpotifyApi.SearchForItemParameterObject;
