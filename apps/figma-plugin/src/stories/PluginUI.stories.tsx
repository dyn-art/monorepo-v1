import type { Meta } from '@storybook/react';

import App from '../ui/App';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Plugin UI',
  component: App,
} satisfies Meta<typeof App>;

export default meta;

export const Default = () => (
  <div style={{ width: 400, height: 600, border: '1px solid #000000' }}>
    <App />
  </div>
);
