/** @type {import('tailwindcss').Config} */
module.exports = {
  // Note: Can't use relative path using '__dirname' as its bundled in '@remotion/cli'
  // and thus the '__dirname' does resolve in '@remotion/cli'
  content: ['./ui/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
