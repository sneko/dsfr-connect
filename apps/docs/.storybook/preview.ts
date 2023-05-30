import '@gouvfr/dsfr/dist/dsfr/dsfr.css';
import '@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js';
import '@gouvfr/dsfr/dist/utility/utility.css';

import { withDsfrTheme } from '@dsfrc/docs/utils/decorators';
import '@dsfrc/dsfr-connect/src/fonts/index.css';

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
    withDsfrTheme({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};
