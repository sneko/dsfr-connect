import { create } from '@storybook/theming/create';

import { assetsBaseUrl, darkColors, lightColors } from 'dsfr-connect/src/common';

export { DocsContainer } from 'dsfr-connect/src/storybook-v7/DocsContainer';

// Since not exported by Storybook
export interface ThemeVars {
  base: 'light' | 'dark';
  colorPrimary?: string;
  colorSecondary?: string;
  appBg?: string;
  appContentBg?: string;
  appBorderColor?: string;
  appBorderRadius?: number;
  fontBase?: string;
  fontCode?: string;
  textColor?: string;
  textInverseColor?: string;
  textMutedColor?: string;
  barTextColor?: string;
  barSelectedColor?: string;
  barBg?: string;
  buttonBg?: string;
  buttonBorder?: string;
  booleanBg?: string;
  booleanSelectedBg?: string;
  inputBg?: string;
  inputBorder?: string;
  inputTextColor?: string;
  inputBorderRadius?: number;
  brandTitle?: string;
  brandUrl?: string;
  brandImage?: string;
  brandTarget?: string;
  gridCellSize?: number;
}

const commonVariables: ThemeVars = {
  base: 'light',
  fontBase: `Marianne, arial, sans-serif`,
  fontCode: 'monospace',
  brandTitle: `Storybook de l'État`,
  brandUrl: './',
  brandImage: `${assetsBaseUrl}logo/marianne.svg`,
  brandTarget: '_self',
  appBorderRadius: 0,
  inputBorderRadius: 0, // Will be set with CSS
  // gridCellSize: ?, // Don't know what it targets
};

const lightVariables: ThemeVars = {
  ...commonVariables,
  base: 'light',
  colorPrimary: lightColors.options.blueFrance._950_100.default,
  colorSecondary: lightColors.options.blueFrance.sun113_625.default,
  appBg: lightColors.options.grey._1000_50.default,
  appContentBg: lightColors.options.grey._1000_100.default,
  appBorderColor: lightColors.decisions.border.default.grey.default,
  textColor: lightColors.decisions.text.default.grey.default,
  textInverseColor: lightColors.decisions.text.inverted.grey.default,
  textMutedColor: lightColors.decisions.text.label.grey.default, // Used for placeholders for example
  buttonBg: lightColors.decisions.background.actionHigh.blueFrance.default,
  buttonBorder: lightColors.decisions.border.actionHigh.blueFrance.default,
  booleanBg: lightColors.decisions.background.alt.blueFrance.default,
  booleanSelectedBg: lightColors.decisions.background.alt.blueFrance.active,
  barTextColor: lightColors.decisions.text.default.grey.default,
  barSelectedColor: lightColors.decisions.text.active.blueFrance.default,
  barBg: lightColors.decisions.background.alt.grey.default,
  inputBg: lightColors.decisions.background.contrast.grey.default,
  inputBorder: lightColors.decisions.border.plain.grey.default,
  inputTextColor: lightColors.decisions.text.label.grey.default,
};

export const lightTheme = create(lightVariables);

const darkVariables: ThemeVars = {
  ...commonVariables,
  base: 'dark',
  colorPrimary: darkColors.options.blueFrance._950_100.default,
  colorSecondary: darkColors.options.blueFrance.sun113_625.default,
  appBg: darkColors.options.grey._1000_50.default,
  appContentBg: darkColors.options.grey._1000_100.default,
  appBorderColor: darkColors.decisions.border.default.grey.default,
  textColor: darkColors.decisions.text.default.grey.default,
  textInverseColor: darkColors.decisions.text.inverted.grey.default,
  textMutedColor: darkColors.decisions.text.label.grey.default, // Used for placeholders for example
  buttonBg: darkColors.decisions.background.actionHigh.blueFrance.default,
  buttonBorder: darkColors.decisions.border.actionHigh.blueFrance.default,
  booleanBg: darkColors.decisions.background.alt.blueFrance.default,
  booleanSelectedBg: darkColors.decisions.background.alt.blueFrance.active,
  barTextColor: darkColors.decisions.text.default.grey.default,
  barSelectedColor: darkColors.decisions.text.active.blueFrance.default,
  barBg: darkColors.decisions.background.alt.grey.default,
  inputBg: darkColors.decisions.background.contrast.grey.default,
  inputBorder: darkColors.decisions.border.plain.grey.default,
  inputTextColor: darkColors.decisions.text.label.grey.default,
};

export const darkTheme = create(darkVariables);
