const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      'lofi',
      {
        figma: {
          // Color
          primary: '#18a0fb', // blue
          secondary: '#7b61ff', // purple
          accent: '#ff00ff', // hot-pink
          info: '#1bc47d', // green
          danger: '#f24822', // red
          warning: '#ffeb00', // yellow
          neutral: '#000000', // black
          'base-100': '#ffffff', // white
          'base-200': '#f0f0f0', // grey
          'base-300': '#e5e5e5', // silver
          'base-content': '#222222', // hud
          'base-400': '#2c2c2c', // toolbar

          // Border radius
          '--rounded-box': '5px',
          '--rounded-btn': '5px',
          '--rounded-badge': '5px',

          // Animation
          '--animation-btn': '0.2s',
          '--animation-input': '0.2s',

          // Text transform
          '--btn-text-case': 'none',

          // Button scale transform
          '--btn-focus-scale': '1.0',

          // Border width
          '--border-btn': '1px',
          '--tab-border': '1px',

          // Border radius for tabs
          '--tab-radius': '5px',
        },
      },
    ],
  },
};
