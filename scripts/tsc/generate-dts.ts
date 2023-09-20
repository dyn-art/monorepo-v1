import { execa } from 'execa';
import path from 'path';
import { Logger } from '../utils';

const logger = new Logger('generate-dts');

export async function generateDts(options: TGenerateDtsOptions = {}) {
  const { tsconfig = path.resolve(process.cwd(), './tsconfig.json') } = options;
  logger.info('Start generating Typescript Declaration files.', {
    args: [{ tsconfig }],
  });
  await execa('pnpm', ['tsc', '--emitDeclarationOnly', '--project', tsconfig]);
  logger.success('Successfully generated Typescript Declaration files.');
}

export type TGenerateDtsOptions = {
  tsconfig?: string;
};
