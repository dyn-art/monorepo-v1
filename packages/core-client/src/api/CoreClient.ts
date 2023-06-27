import axios, { AxiosInstance } from 'axios';
import { coreConfig } from '../environment';

export class EtsyClient {
  private readonly _httpClient: AxiosInstance;

  constructor() {
    this._httpClient = axios.create({
      baseURL: coreConfig.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
