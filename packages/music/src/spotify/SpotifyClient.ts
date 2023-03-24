import axios, { AxiosInstance } from 'axios';
import { spotifyConfig } from '../environment';
import { OAuth2Service } from './OAuth2Service';
import {
  TSpotifySearchForItemParameterDto,
  TSpotifySearchResponseDto,
} from './types';

export class SpotifyClient {
  private readonly httpClient: AxiosInstance;
  public readonly authService: OAuth2Service;

  constructor(authService: OAuth2Service) {
    this.authService = authService;
    this.httpClient = axios.create({
      baseURL: spotifyConfig.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Intercept requests to inject the Authorization header
    this.httpClient.interceptors.request.use(
      async (config) => {
        const token = await this.authService.getAccessToken();
        if (token != null) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // https://developer.spotify.com/documentation/web-api/reference/#/operations/search
  public async search(options: {
    query: TSpotifySearchForItemParameterDto['q'];
    type?: TSpotifySearchForItemParameterDto['type'];
    market?: TSpotifySearchForItemParameterDto['market'];
    limit?: TSpotifySearchForItemParameterDto['limit'];
  }) {
    const { query, type, market, limit = 5 } = options;
    try {
      const response = await this.httpClient.get<TSpotifySearchResponseDto>(
        '/search',
        {
          params: {
            q: query,
            type,
            market,
            limit,
          } as TSpotifySearchForItemParameterDto,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}
