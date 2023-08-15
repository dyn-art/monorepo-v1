import { defineConfig, mergeConfig } from 'vitest/config';
import { nodeConfig } from '@pda/viteconfig';

export default mergeConfig(nodeConfig, defineConfig({}));
