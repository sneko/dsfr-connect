import { withThemeByDataAttribute } from '@storybook/addon-styling';
import { Meta, StoryFn } from '@storybook/html';
import bootstrapScript from 'bootstrap/dist/js/bootstrap.bundle.min.js?raw';

import componentStyle from '@dsfrc/dsfr-connect/src/bootstrap-v5/index.scss?inline';

import componentHtml from './index.html?raw';

export default {
  title: 'gallery/{{framework}}/{{component}}',
  decorators: [
    (story) => {
      // Import the style and script here to not pollute other framework stories
      const styleElement = document.createElement('style');
      styleElement.textContent = componentStyle;

      const scriptElement = document.createElement('script');
      scriptElement.innerHTML = bootstrapScript;

      return `${styleElement.outerHTML}${story()}${scriptElement.outerHTML}`;
    },
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-bs-theme',
    }),
  ],
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
