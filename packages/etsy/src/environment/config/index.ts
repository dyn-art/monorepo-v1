import etsyConfig from './etsy.config';

export const config = {
  etsy: etsyConfig,
};

console.log('[@pda/etsy] Loaded configuration', config);

export default config;

export { etsyConfig };
