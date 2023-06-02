import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

export default {
  input: './src/index.tsx',
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
