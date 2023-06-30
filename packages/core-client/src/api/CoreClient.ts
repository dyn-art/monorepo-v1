import {
  TGet_Media_PreSignedDownloadUrl_ParamsDTO,
  TGet_Media_PreSignedDownloadUrl_ResponseDTO,
  TGet_Media_PreSignedUploadUrl_QueryParamsDTO,
  TGet_Media_PreSignedUploadUrl_ResponseDTO,
} from '@pda/core-types';
import axios, { AxiosInstance } from 'axios';
import { coreConfig } from '../environment';
import { mapAxiosError } from '../utils';

export class CoreClient {
  private readonly _httpClient: AxiosInstance;

  constructor() {
    this._httpClient = axios.create({
      baseURL: coreConfig.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async getPreSignedUploadUrl(
    key: string,
    params: Omit<TGet_Media_PreSignedUploadUrl_QueryParamsDTO, 'key'> = {}
  ): Promise<TGet_Media_PreSignedUploadUrl_ResponseDTO> {
    try {
      const response =
        await this._httpClient.get<TGet_Media_PreSignedUploadUrl_ResponseDTO>(
          `/media/pre-signed-upload-url`,
          {
            params: {
              key,
              ...params,
            } as TGet_Media_PreSignedDownloadUrl_ParamsDTO,
          }
        );
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  }

  public async getPreSignedDownloadUrl(
    key: string
  ): Promise<TGet_Media_PreSignedDownloadUrl_ResponseDTO> {
    try {
      const response =
        await this._httpClient.get<TGet_Media_PreSignedDownloadUrl_ResponseDTO>(
          `/media/pre-signed-download-url/${key}`
        );
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  }
}
