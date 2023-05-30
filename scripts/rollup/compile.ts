import { OutputOptions, rollup, RollupOptions } from 'rollup';
import { Logger } from '../utils';

const logger = new Logger('compile-with-rollup');

export async function compile(options: RollupOptions) {
  logger.info('Start compiling.', {
    args: [{ options }],
  });
  const build = await rollup(options);
  const outputs: OutputOptions[] = Array.isArray(options.output)
    ? options.output
    : options.output != null
    ? [options.output]
    : [];
  const response = await Promise.all(
    outputs.map((output) => build.write(output))
  );
  logger.success('Completed compiling.');
  return response;
}
