import { startReactDsfr } from '@codegouvfr/react-dsfr/spa';
import type { StoryFn } from '@storybook/react';
import React from 'react';

import { MuiDsfrThemeProvider } from '@dsfrc/dsfr-connect/src/mui-v5';

startReactDsfr({
  defaultColorScheme: 'light', // force to be the same than for the decorator
  useLang: () => 'fr',
});

export const withMuiTheme = (Story: StoryFn) => (
  <MuiDsfrThemeProvider>
    <Story />
  </MuiDsfrThemeProvider>
);
