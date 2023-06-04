import { StorybookConfig } from '@storybook/html-vite';

import { getConfig, viteFinalFactory } from '@dsfrc/docs/utils/storybook/main';
import { frameworks } from '@dsfrc/docs/utils/targets';

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
    SELECTED_FRAMEWORKS: process.env.SELECTED_FRAMEWORKS || '',
    CRISP_WEBSITE_ID: process.env.CRISP_WEBSITE_ID || 'no_crisp_settings',
  }),
  viteFinal: viteFinalFactory(),
  refs: (config, options) => {
    const isDev = options.configType === 'DEVELOPMENT';
    const selectedFrameworks = (process.env.SELECTED_FRAMEWORKS || '').split(',');
    const refs: any = {};

    frameworks
      .filter((framework) => {
        return selectedFrameworks.includes(framework.name);
      })
      .forEach((framework) => {
        refs[framework.name] = {
          title: framework.name,
          url: isDev ? `http://localhost:${framework.port}/` : `/frameworks/${framework.name}`,
          expanded: false,
        };
      });

    return refs;
  },
};

export default config;
