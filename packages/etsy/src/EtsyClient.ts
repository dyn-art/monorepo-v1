import axios, { AxiosInstance } from 'axios';
import { etsyConfig } from './environment';
import { OAuth2Service } from './OAuth2Service';
import { TEtsyPingResponseDto, TGetMeResponseDto } from './types';

export class EtsyClient {
  private readonly httpClient: AxiosInstance;
  private readonly authService: OAuth2Service;

  constructor(authService: OAuth2Service) {
    this.authService = authService;
    this.httpClient = axios.create({
      baseURL: etsyConfig.baseUrl,
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
        config.headers['x-api-key'] = this.authService.config.clientId;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public async ping(): Promise<boolean> {
    try {
      // Send request
      const response = await this.httpClient.get<TEtsyPingResponseDto>(
        '/application/openapi-ping'
      );
      return response.data.application_id != null;
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  public async getMe(): Promise<TGetMeResponseDto | null> {
    try {
      const response = await this.httpClient.get<TGetMeResponseDto>(
        '/application/users/me'
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  // TODO
  public async getShopReceipts(shopId: string): Promise<any> {
    try {
      const response = await this.httpClient.get<any>(
        `/application/shops/${shopId}/receipts`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}
