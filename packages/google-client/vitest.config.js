import { defineConfig, mergeConfig } from 'vitest/config';
import { nodeConfig } from '@pda/viteconfig';

require('dotenv').config({ path: '.env.test.local' });

export default mergeConfig(nodeConfig, defineConfig({}));
