import { StorybookConfig } from '@storybook/html-vite';

import { getConfig, viteFinalFactory } from '@dsfrc/docs/utils/storybook/main';
import { TargetName } from '@dsfrc/docs/utils/targets';

const framework: TargetName = 'bootstrap-v5';

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
  viteFinal: viteFinalFactory({
    framework: framework,
  }),
};

export default config;
