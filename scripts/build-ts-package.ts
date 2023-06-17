#!/usr/bin/env node

import chalk from 'chalk';
import path from 'path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import * as rollup from './rollup';
import * as tsc from './tsc';
import { Logger, readFile } from './utils';

const logger = new Logger('ts-library');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .options({
    prod: {
      type: 'boolean',
      default: false,
      description: 'Build in production mode',
    },
    tsc: {
      type: 'boolean',
      default: false,
      description: 'Compile with Typescript Compiler',
    },
    analyze: {
      type: 'boolean',
      default: false,
      description: 'Generate bundle analytics.',
    },
    sourcemap: {
      type: 'boolean',
      default: true,
      description: 'Generate sourcemap.',
    },
  })
  .parseSync();

const { tsc: useTsc, prod: isProduction, analyze, sourcemap } = argv;

async function build() {
  const startTime = Date.now();
  logger.info(`Start building package.`);

  try {
    // Read in additional rollup options
    const rollupConfigPath = path.resolve(process.cwd(), './rollup.config.js');
    const rollupOptions = await readFile<
      rollup.TCreatePackageOptions['rollupOptions']
    >(rollupConfigPath);
    if (rollupOptions != null) {
      logger.info(`Detected rollup.config at ${chalk.green(rollupConfigPath)}`);
    }

    if (useTsc) {
      await tsc.compile();
    } else {
      await rollup.compile(
        rollup.createPackageConfig({
          format: 'esm',
          isProduction,
          preserveModules: true,
          analyze,
          sourcemap,
          rollupOptions: rollupOptions ?? undefined,
        })
      );
      await rollup.compile(
        rollup.createPackageConfig({
          format: 'cjs',
          isProduction,
          preserveModules: true,
          analyze,
          sourcemap,
          rollupOptions: rollupOptions ?? undefined,
        })
      );
      await tsc.generateDts();
    }

    logger.info(
      `Package was built in ${chalk.green(
        `${((Date.now() - startTime) / 1000).toFixed(2)}s`
      )}.`
    );
  } catch (e: any) {
    logger.error(`Failed to compile package!`);
    console.error(`${e.toString()}\n`, { e });
    process.exit(1);
  }
}

build();
