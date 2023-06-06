import { setup } from '@storybook/vue3';

import '@dsfrc/dsfr-connect/src/fonts/index.scss';

import { registerPlugins } from './plugins';
import { withVuetifyTheme } from './withVuetifyTheme';

setup((app) => {
  registerPlugins(app);
});

// This export is statically analyzed by Storybook so we cannot reuse import and reuse `@dsfrc/docs/.storybook/common/preview`
// we have to make sure it's in sync (ref: https://github.com/storybookjs/storybook/commit/6753867b837b558d45408b3fdc8be0900fbf6995)
export default {
  parameters: {
    options: {
      showPanel: false,
    },
    controls: {
      hideNoControlsWarning: true,
    },
  },
  decorators: [
    withVuetifyTheme({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};
