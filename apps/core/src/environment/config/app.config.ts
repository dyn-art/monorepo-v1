import { replaceBracket } from '../../core/utils';
import { STAGE } from './types';

const port = process.env.APP_PORT ?? 9000;
const version = process.env.APP_VERSION ?? 1;
const packageVersion = process.env.npm_package_version;
const baseUrl = process.env.APP_BASE_URL ?? 'http://localhost:{}';
const corsOrigins = process.env.APP_CORS_ORIGIN ?? 'http://localhost:3000';
const nodeEnv = process.env.NODE_ENV ?? STAGE.LOCAL;
const rootPath = process.cwd() ?? 'not-set';

export default {
  version,
  packageVersion,
  port,
  baseUrl: `${replaceBracket(baseUrl, port.toString())}/v${version}`,
  corsOrigins: corsOrigins.split(', '),
  stage: nodeEnv as STAGE,
  rootPath,
  repository: 'https://github.com/physical-art/physicaldotart',
};
