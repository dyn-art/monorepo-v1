#!/usr/bin/env node

import chalk from 'chalk';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import * as rollup from './rollup';
import * as tsc from './tsc';
import { Logger } from './utils';

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
  })
  .parseSync();

const isProduction = argv.prod;
const useTsc = argv.tsc;

async function build() {
  logger.info(`Start building package.`);
  try {
    const startTime = Date.now();

    if (useTsc) {
      await tsc.compile();
    } else {
      await rollup.compile(rollup.createCommonJSConfig({ isProduction }));
      await rollup.compile(rollup.createESMConfig({ isProduction }));
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
