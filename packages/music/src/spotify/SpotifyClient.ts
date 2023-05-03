import axios, { AxiosInstance } from 'axios';
import { spotifyConfig } from '../environment';
import { OAuth2Service } from './OAuth2Service';
import {
  TGetTrackResponseDto,
  TSearchForItemParameterDto,
  TSearchResponseDto,
} from './types';

export class SpotifyClient {
  private readonly _httpClient: AxiosInstance;
  public readonly _authService: OAuth2Service;

  constructor(authService: OAuth2Service) {
    this._authService = authService;
    this._httpClient = axios.create({
      baseURL: spotifyConfig.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Intercept requests to inject the Authorization header
    this._httpClient.interceptors.request.use(
      async (config) => {
        const token = await this._authService.getAccessToken();
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
    query: TSearchForItemParameterDto['q'];
    type?: TSearchForItemParameterDto['type'];
    market?: TSearchForItemParameterDto['market'];
    limit?: TSearchForItemParameterDto['limit'];
  }): Promise<TSearchResponseDto | null> {
    const { query, type, market, limit = 5 } = options;
    try {
      const response = await this._httpClient.get<TSearchResponseDto>(
        '/search',
        {
          params: {
            q: query,
            type,
            market,
            limit,
          } as TSearchForItemParameterDto,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  public async getTrack(id: string): Promise<TGetTrackResponseDto | null> {
    try {
      const response = await this._httpClient.get<TGetTrackResponseDto>(
        `/tracks/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}
