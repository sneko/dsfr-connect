import { Meta, StoryFn } from '@storybook/vue3';

import ComponentVue from './index.vue';
import componentVueRaw from './index.vue?raw';

export default {
  title: 'gallery/{{component}}',
  component: ComponentVue,
  parameters: {
    storySource: {
      source: componentVueRaw,
    },
  },
  render: (args) => ({
    components: {
      // ComponentVue
      ComponentVue: ComponentVue as any,
    },
    setup() {
      return {
        ...args,
      };
    },
    template: '<component-vue />',
  }),
} as Meta<any>;

export const Default = {} as StoryFn<any>;
