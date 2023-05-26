import { StorybookConfig } from '@storybook/html-vite';

import { getConfig, viteFinalFactory } from '@dsfrc/docs/utils/storybook/main';

const commonConfig = getConfig();

const config: StorybookConfig = {
  ...commonConfig,
  framework: {
    ...((commonConfig.framework as object) || {}),
    name: '@storybook/html-vite',
    options: {},
  },
  core: {
    ...(commonConfig.core || {}),
    builder: '@storybook/builder-vite',
  },
  env: (config) => ({
    ...config,
    CRISP_WEBSITE_ID: process.env.CRISP_WEBSITE_ID || 'no_crisp_settings',
  }),
  viteFinal: viteFinalFactory(),
};

export default config;
