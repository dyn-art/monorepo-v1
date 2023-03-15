module.exports = {
  plugins: {
    tailwindcss: {
      // Note: Can't use relative path using '__dirname' as its bundled in '@remotion/cli'
      // and thus the '__dirname' does resolve in '@remotion/cli'
      config: './src/ui/tailwind.config.js',
    },
    autoprefixer: {},
    'postcss-preset-env': {},
  },
};
