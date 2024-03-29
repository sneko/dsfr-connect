import { withThemeByDataAttribute } from '@storybook/addon-styling';

import '@dsfrc/dsfr-connect/src/fonts/definition.scss';
import { darkTheme, lightTheme } from '@dsfrc/dsfr-connect/src/storybook-v7';

import { withMuiTheme } from './withDsfrMuiTheme';

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
      attributeName: 'data-fr-theme',
    }),
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-fr-scheme',
    }),
    withMuiTheme,
  ],
};
