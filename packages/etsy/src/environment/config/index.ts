import etsyConfig from './etsy.config';

export const config = {
  etsy: etsyConfig,
};

console.log('Loaded configuration', config);

export default config;

export { etsyConfig };
