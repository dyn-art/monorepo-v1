export type TTrainingsPayloadDto = {
  id: string;
  input: {
    instance_prompt: string;
    class_prompt: string;
    instance_data: string;
    max_train_steps: number;
  };
  logs: string;
  model: string;
  status: string;
  trainer_version: string;
  webhook_completed: string;
  version: string;
};

export type TPredictionResponseDto = {
  id: string;
  version: string;
  urls: {
    get: string;
    cancel: string;
  };
  created_at?: string;
  started_at?: string;
  completed_at?: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'failed';
  input: {
    text: string;
  };
  output?: string[];
  error?: string;
  logs?: string;
  metrics: object;
};
