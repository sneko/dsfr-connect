import { Meta, StoryFn } from '@storybook/html';

import componentHtml from './index.html?raw';

export default {
  title: 'gallery/{{component}}',
  parameters: {
    storySource: {
      source: componentHtml,
    },
  },
  render: ({ label, ...args }) => {
    return componentHtml;
  },
} as Meta<any>;

export const Default = {} as StoryFn<any>;
