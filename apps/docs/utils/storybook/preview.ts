import { darkTheme, lightTheme } from '@dsfrc/dsfr-connect/src/storybook-v7';

// [IMPORTANT] When modifying the following do not forget to modify each `preview.ts` of each Storybook
// This is required because this file is statically analyzed, it cannot import this common definition
export const preview = {
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
  decorators: [],
};
