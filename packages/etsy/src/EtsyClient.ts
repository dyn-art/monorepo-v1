import axios, { AxiosInstance } from 'axios';
import { etsyConfig } from './environment';
import { OAuth2Service } from './OAuth2Service';
import {
  TGetMeResponseDto,
  TGetShopReceiptsQueryParametersDto,
  TPingResponseDto,
} from './types';

export class EtsyClient {
  private readonly httpClient: AxiosInstance;
  public readonly authService: OAuth2Service;

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
      const response = await this.httpClient.get<TPingResponseDto>(
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

  public async getShopReceipts(
    shopId: string,
    params: TGetShopReceiptsQueryParametersDto = {}
  ): Promise<any> {
    try {
      const response = await this.httpClient.get<any>(
        `/application/shops/${shopId}/receipts`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}
