import { StorybookConfig } from '@storybook/html-vite';
import path from 'path';

import { getConfig, viteFinalFactory } from '@dsfrc/docs/.storybook/common/main';

const framework: string = path.basename(__dirname);

const commonConfig = getConfig(framework);

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
  viteFinal: viteFinalFactory(framework),
};

export default config;
