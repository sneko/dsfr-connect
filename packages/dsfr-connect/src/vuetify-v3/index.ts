import { VuetifyOptions } from 'vuetify';

import { darkColors, lightColors } from '../common';

export function getVuetifyOptions(): VuetifyOptions {
  return {
    defaults: {
      global: {
        ripple: false,
        elevation: 0,
      },
      VAlert: {
        variant: 'outlined',
      },
      VBtn: {
        color: 'primary',
      },
      VTextField: {
        color: 'primary',
        // variant: 'underlined',
        // persistentPlaceholder: true,
      },
      VPagination: {
        color: 'primary',
      },
      VSnackbar: {
        color: 'secondary',
      },
    },
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            background: lightColors.options.grey._1000_50.default,
            surface: lightColors.options.grey._1000_100.default,
            primary: lightColors.options.blueFrance.sun113_625.default,
            secondary: lightColors.options.blueFrance._950_100.default,
            success: lightColors.options.success._425_625.default,
            warning: lightColors.options.warning._425_625.default,
            error: lightColors.options.error._425_625.default,
            info: lightColors.options.info._425_625.default,
          },
        },
        dark: {
          dark: true,
          colors: {
            background: darkColors.options.grey._1000_50.default,
            surface: darkColors.options.grey._1000_50.default,
            primary: darkColors.options.blueFrance.sun113_625.default,
            secondary: darkColors.options.blueFrance._950_100.default,
            success: darkColors.options.success._425_625.default,
            warning: darkColors.options.warning._425_625.default,
            error: darkColors.options.error._425_625.default,
            info: darkColors.options.info._425_625.default,
          },
        },
      },
    },
  };
}
