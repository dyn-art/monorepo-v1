import { execa } from 'execa';
import path from 'path';
import { Logger } from '../utils';

const logger = new Logger('compile-with-tsc');

export async function compile() {
  const tsconfig = path.resolve('./tsconfig.json');
  logger.info('Start compiling Typescript files.', {
    args: [{ tsconfig }],
  });
  await execa('pnpm', ['tsc', '--project', tsconfig]);
  logger.success('Completed compiling Typescript files.');
}
