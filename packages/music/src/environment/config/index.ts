import geniusConfig from './genius.config';
import spotifyConfig from './spotify.config';

export const config = {
  spotify: spotifyConfig,
  genius: geniusConfig,
};

console.log('Loaded configuration', config);

export default config;

export { spotifyConfig, geniusConfig };
