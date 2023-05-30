import { execa } from 'execa';
import path from 'path';
import { Logger } from '../utils';

const logger = new Logger('generate-dts');

export async function generateDts() {
  const tsconfig = path.resolve('./tsconfig.json');
  logger.info('Start generating Typescript Declaration files.', {
    args: [{ tsconfig }],
  });
  await execa('pnpm', ['tsc', '--emitDeclarationOnly', '--project', tsconfig]);
  logger.success('Successfully generated Typescript Declaration files.');
}
