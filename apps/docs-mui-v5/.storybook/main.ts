import { StorybookConfig } from '@storybook/react-vite';

import { getConfig, viteFinalFactory } from '@dsfrc/docs/utils/storybook/main';
import { TargetName } from '@dsfrc/docs/utils/targets';

const framework: TargetName = 'mui-v5';

const commonConfig = getConfig(framework);

const config: StorybookConfig = {
  ...commonConfig,
  framework: {
    ...((commonConfig.framework as object) || {}),
    name: '@storybook/react-vite',
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
