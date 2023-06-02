import {
  InputPluginOption,
  OutputOptions,
  rollup,
  RollupOptions,
} from 'rollup';
import { Logger } from '../utils';

const logger = new Logger('compile-with-rollup');

export async function compile(options: RollupOptions) {
  logger.info('Start compiling.', {
    args: [
      {
        options: {
          ...options,
          plugins: pluginsToKeys(options.plugins),
        },
      },
    ],
  });
  const build = await rollup(options);
  const outputs: OutputOptions[] = formatOutput(options.output);
  const response = await Promise.all(
    outputs.map((output) => build.write(output))
  );
  logger.success('Completed compiling.');
  return response;
}

function pluginsToKeys(plugins: InputPluginOption) {
  return Array.isArray(plugins)
    ? plugins.map((plugin) => (plugin != null ? plugin['name'] : plugin))
    : plugins;
}

function formatOutput(output: RollupOptions['output']) {
  return Array.isArray(output) ? output : output != null ? [output] : [];
}
