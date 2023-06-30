import axios from 'axios';
import { CoreClient } from './api';
import { mapAxiosError } from './utils';

export class CoreService {
  public readonly coreClient: CoreClient;

  constructor(coreClient: CoreClient) {
    this.coreClient = coreClient;
  }

  public async downloadJsonFromS3<TResponse extends Record<string, any>>(
    key: string
  ): Promise<TResponse> {
    try {
      const responseDto = await this.coreClient.getPreSignedDownloadUrl(key);
      const downloadResponse = await axios.get<TResponse>(
        responseDto.download_url
      );
      return downloadResponse.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  }
}
