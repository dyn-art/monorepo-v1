import { RollupOptions } from 'rollup';
import { compile } from './compile';

export async function compileAll(options: RollupOptions[]) {
  return Promise.all(options.map((option) => compile(option)));
}
