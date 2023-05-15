import appConfig from './app.config';
import s3Config from './s3.config';

export const config = {
  app: appConfig,
  s3: s3Config,
};
export { appConfig, s3Config };

export default config;
