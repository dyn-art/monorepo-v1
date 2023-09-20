import { defineConfig, mergeConfig } from 'vitest/config';
import { nodeConfig } from '@dyn/viteconfig';

require('dotenv').config({ path: '.env.test.local' });

export default mergeConfig(nodeConfig, defineConfig({}));
