import { withThemeByDataAttribute } from '@storybook/addon-styling';
import 'infima/dist/css/default/default.css';

import '@dsfrc/dsfr-connect/src/fonts/definition.scss';
import '@dsfrc/dsfr-connect/src/infima-v1/index.scss';
import { darkTheme, lightTheme } from '@dsfrc/dsfr-connect/src/storybook-v7';

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
    darkMode: {
      light: lightTheme,
      dark: darkTheme,
      current: 'light',
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};
