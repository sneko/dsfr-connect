const path = require('path');
const { mergeConfig } = require('vite');
const vitePluginRequire = require('vite-plugin-require');
const viteTsconfig = require('vite-tsconfig-paths');

const pluginRequire = vitePluginRequire.default;
const tsconfigPaths = viteTsconfig.default;

const config = {
  stories: [
    // Lookup wildcards should not meet a `node_modules` because due to `pnpm` symlinks everything break
    // We scoped everything in folders like `stories` and `src` in each package
    // Ref: https://github.com/storybookjs/storybook/issues/11181#issuecomment-1372243094
    path.resolve(__dirname, '../../../apps/docs/stories/**/*.stories.@(js|ts|jsx|tsx|mdx)'),
  ],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
        controls: false,
      },
    },
    {
      name: '@storybook/addon-storysource',
      options: {
        loaderOptions: {
          prettierConfig: { singleQuote: true },
        },
      },
    },
    '@storybook/addon-styling',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  core: {
    enableCrashReports: false,
    disableTelemetry: true,
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [pluginRequire()],
      resolve: {
        alias: [
          {
            find: '@dsfrc/docs',
            replacement: path.resolve(__dirname, '../../../apps/docs'),
          },
          {
            find: '@dsfrc/dsfr-connect',
            replacement: path.resolve(__dirname, '../../../packages/dsfr-connect'),
          },
        ],
      },
    });
  },
};

export default config;
