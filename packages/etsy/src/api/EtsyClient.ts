import axios, { AxiosInstance } from 'axios';
import { etsyConfig } from '../environment';
import { NetworkException } from '../exceptions';
import { isStatusCode, mapAxiosError } from '../utils';
import { OAuth2Service } from './OAuth2Service';
import {
  TGetMeResponseDto,
  TGetShopReceiptsQueryParametersDto,
  TGetShopReceiptsResponseDto,
  TPingResponseDto,
} from './types';

export class EtsyClient {
  private readonly _httpClient: AxiosInstance;
  private readonly _authService: OAuth2Service;

  constructor(authService: OAuth2Service) {
    this._authService = authService;
    this._httpClient = axios.create({
      baseURL: etsyConfig.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
  }

  public get authService() {
    return this._authService;
  }

  private setupInterceptors() {
    // Intercept requests to inject the Authorization header
    this._httpClient.interceptors.request.use(
      async (config) => {
        const token = await this._authService.getAccessToken();
        if (token != null) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers['x-api-key'] = this._authService._config.clientId;
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
      const response = await this._httpClient.get<TPingResponseDto>(
        '/application/openapi-ping'
      );
      return response.data.application_id != null;
    } catch (error) {
      // do nothing
    }
    return false;
  }

  public async getMe(): Promise<TGetMeResponseDto | null> {
    try {
      const response = await this._httpClient.get<TGetMeResponseDto>(
        '/application/users/me'
      );
      return response.data;
    } catch (error) {
      if (isStatusCode(error, 404)) {
        return null;
      } else {
        throw mapAxiosError(error, NetworkException);
      }
    }
  }

  public async getShopReceipts(
    shopId: string,
    params: TGetShopReceiptsQueryParametersDto = {}
  ): Promise<TGetShopReceiptsResponseDto | null> {
    try {
      const response = await this._httpClient.get<TGetShopReceiptsResponseDto>(
        `/application/shops/${shopId}/receipts`,
        { params }
      );
      return response.data;
    } catch (error) {
      if (isStatusCode(error, 404)) {
        return null;
      } else {
        throw mapAxiosError(error, NetworkException);
      }
    }
  }
}
