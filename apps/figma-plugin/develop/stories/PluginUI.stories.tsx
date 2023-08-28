import type { Meta } from '@storybook/react';
import PreviewApp from './PreviewApp';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Plugin UI',
  component: PreviewApp,
} satisfies Meta<typeof PreviewApp>;

export default meta;

export const Default = () => <PreviewApp />;
