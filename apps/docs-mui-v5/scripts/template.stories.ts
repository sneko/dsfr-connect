import { Meta, StoryFn } from '@storybook/react';

import ComponentReact from './Index';
import componentReactRaw from './Index?raw';

export default {
  title: 'gallery/{{component}}',
  component: ComponentReact,
  parameters: {
    storySource: {
      source: componentReactRaw,
    },
  },
} as Meta<any>;

export const Default = {} as StoryFn<any>;
