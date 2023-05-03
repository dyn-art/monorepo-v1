import { STAGE } from './types';

const version = process.env.APP_VERSION ?? 1;
const packageVersion = process.env.npm_package_version;
const nodeEnv = process.env.NODE_ENV ?? STAGE.LOCAL;

export default {
  version,
  packageVersion,
  stage: nodeEnv as STAGE,
  repository: 'https://github.com/physical-art/physicaldotart',
};
