import astriaConfig from './astria.config';
import replicateConfig from './replicate.config';

export const config = {
  astria: astriaConfig,
  replicate: replicateConfig,
};

console.log('[@pda/ai] Loaded configuration', config);

export default config;

export { astriaConfig, replicateConfig };
