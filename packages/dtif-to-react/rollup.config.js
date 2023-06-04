import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

/** @type {import('rollup').RollupOptions} */
export default {
  input: './src/index.ts',
  plugins: [
    {
      plugin: postcss({
        plugins: [autoprefixer()],
        sourceMap: true,
        extract: true,
        minimize: true,
      }),
      after: 'esbuild',
    },
  ],
};
