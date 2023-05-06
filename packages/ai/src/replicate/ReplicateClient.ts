import axios, { AxiosInstance } from 'axios';
import { replicateConfig } from '../environment';
import { TPredictionResponseDto, TTrainingsPayloadDto } from './types';

export class ReplicateClient {
  private readonly _httpClient: AxiosInstance;
  private readonly _dreamboothExperimentalHttpClient: AxiosInstance;

  private readonly _config: Omit<TReplicateClientConfig, 'apiToken'>;

  constructor(config: TReplicateClientConfig) {
    this._config = config;
    this._httpClient = axios.create({
      baseURL: replicateConfig.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${config.apiToken}`,
      },
    });
    this._dreamboothExperimentalHttpClient = axios.create({
      baseURL: replicateConfig.dreamboothExperimentalBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${config.apiToken}`,
      },
    });
  }

  public async postTrainings(
    instanceClass: string,
    userId: string
  ): Promise<TTrainingsPayloadDto | null> {
    try {
      const response =
        await this._dreamboothExperimentalHttpClient.post<TTrainingsPayloadDto>(
          '/trainings',
          {
            input: {
              instance_prompt: `a photo of a ${this._config.instanceToken} ${instanceClass}`,
              class_prompt: `a photo of a ${instanceClass}`,
              instance_data: this._config.webhooks.instanceData(userId),
              max_train_steps: this._config.maxTrainingSteps || 2000,
              num_class_images: 200,
              learning_rate: 1e-6,
            },
            model: `${this._config.username}/${userId}`,
            webhook_completed: this._config.webhooks.completed(userId),
          }
        );
      return response.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  public async getTrainingStatus(
    userId: string
  ): Promise<TTrainingsPayloadDto | null> {
    try {
      const response = await this._httpClient.get<TTrainingsPayloadDto>(
        `/trainings/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  public async getPredictionStatus(
    predictId: string
  ): Promise<TPredictionResponseDto | null> {
    try {
      const response = await this._httpClient.get(`predictions/${predictId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  public async postPrediction(
    config: TPredictionConfig
  ): Promise<TPredictionResponseDto | null> {
    try {
      const response = await this._httpClient.post<TPredictionResponseDto>(
        '/predictions',
        {
          input: {
            prompt: config.prompt,
            negative_prompt: config.negativePrompt,
            ...(config.seed != null ? { seed: config.seed } : {}),
            disable_safety_check: true,
          },
          webhook_completed: config.webhooks.completed(config.userId),
          version: config.version,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}

type TPredictionConfig = {
  version: string;
  prompt: string;
  negativePrompt: string;
  seed?: string;
  userId: string;
  webhooks: {
    completed: (userId: string) => string;
  };
};

type TReplicateClientConfig = {
  apiToken: string;
  instanceToken: string;
  username: string;
  webhooks: {
    completed: (userId: string) => string;
    instanceData: (userId: string) => string;
  };
  maxTrainingSteps: number;
};
