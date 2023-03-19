import axios, { AxiosInstance } from 'axios';
import { spotifyConfig } from '../environment';
import { OAuth2Service } from './OAuth2Service';
import {
  TSpotifySearchForItemParameterDto,
  TSpotifySearchResponseDto,
} from './types';

export class SpotifyClient {
  private httpClient: AxiosInstance;
  private authService: OAuth2Service;

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

  public async search(options: { params: TSpotifySearchForItemParameterDto }) {
    try {
      const response = await this.httpClient.get<TSpotifySearchResponseDto>(
        '/search',
        {
          params: options.params,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }

    return null;
  }
}
