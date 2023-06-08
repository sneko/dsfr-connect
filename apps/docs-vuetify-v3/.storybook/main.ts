import { StorybookConfig } from '@storybook/vue3-vite';
import path from 'path';
import vuetify from 'vite-plugin-vuetify';

import { getConfig, viteFinalFactory } from '@dsfrc/docs/utils/storybook/main';
import { TargetName } from '@dsfrc/docs/utils/targets';

const framework: TargetName = 'vuetify-v3';

const commonConfig = getConfig(framework);

const config: StorybookConfig = {
  ...commonConfig,
  framework: {
    ...((commonConfig.framework as object) || {}),
    name: '@storybook/vue3-vite',
    options: {},
  },
  core: {
    ...(commonConfig.core || {}),
    builder: '@storybook/builder-vite',
  },
  viteFinal: viteFinalFactory({
    framework: framework,
    configToMerge: (options) => {
      return {
        optimizeDeps: {
          exclude: options.configType !== 'PRODUCTION' ? ['@storybook/addon-styling', 'vuetify'] : [], // Avoid optimizing those librairies since directly imported (otherwise it takes more time and requires sometimes reloading the page)
        },
        plugins: [
          vuetify({
            autoImport: true,
            styles: { configFile: path.resolve(__dirname, `../../../packages/dsfr-connect/src/vuetify-v3/settings.scss`) },
          }),
        ],
        resolve: {
          alias: [
            {
              find: '@/util',
              replacement: path.resolve(__dirname, '../stories/framework/util'),
            },
          ],
        },
      };
    },
  }),
};

export default config;
