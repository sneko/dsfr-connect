import { StorybookConfig } from '@storybook/html-vite';

import { getConfig, viteFinalFactory } from '@dsfrc/docs/.storybook/common/main';

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
  viteFinal: viteFinalFactory(),
};

export default config;
