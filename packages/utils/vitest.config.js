import { defineConfig, mergeConfig } from 'vitest/config';
import { nodeConfig } from '@dyn/viteconfig';

export default mergeConfig(nodeConfig, defineConfig({}));
