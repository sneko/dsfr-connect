import { Options, Preset, StorybookConfig } from '@storybook/types';
import path from 'path';
import remarkGfm from 'remark-gfm';
import { InlineConfig, mergeConfig } from 'vite';
import { normalizePath } from 'vite';
import pluginRequire from 'vite-plugin-require';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { managerHeadFactory } from '@dsfrc/dsfr-connect/src/storybook-v7/theme';

// Environment variables needs to be provided at 2 places for internal packages using `process.env`
// Ref: https://github.com/storybookjs/storybook/issues/18920
function getEnvironmentVariables(environment: 'development' | 'production'): Record<string, string> {
  const isProduction = environment === 'production';

  return {
    DSFR_CONNECT_ASSETS_BASE_URL: isProduction ? './' : '/assets/',
  };
}

export function getConfig(framework?: string): StorybookConfig {
  const stories: string[] = [
    // Lookup wildcards should not meet a `node_modules` because due to `pnpm` symlinks everything break
    // We scoped everything in folders like `stories` and `src` in each package
    // Ref: https://github.com/storybookjs/storybook/issues/11181#issuecomment-1372243094
  ];

  // Stories from other storybooks will be listed thanks to references if launched
  if (framework) {
    stories.push(path.resolve(__dirname, `../../../../apps/docs-${framework}/stories/**/*.stories.@(js|ts|jsx|tsx|mdx)`));
  } else {
    stories.push(path.resolve(__dirname, `../../../../apps/docs/stories/**/*.@(mdx)`));
    stories.push(path.resolve(__dirname, `../../../../apps/docs/stories/**/*.stories.@(js|ts|jsx|tsx)`));
  }

  const addons: Preset[] = [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
        controls: false,
        docs: !!framework,
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
    'storybook-dark-mode',
  ];

  if (!framework) {
    addons.push({
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm], // Needed to format tables (but needs to disable the default `docs` from `@storybook/addon-essentials`)
          },
        },
      },
    });
  }

  return {
    managerHead: managerHeadFactory({
      storybookStylePath: '/assets/storybook/index.css',
      faviconFolderPath: '/assets/favicon/',
    }),
    stories: stories,
    staticDirs: ['../public'],
    addons: addons,
    core: {
      enableCrashReports: false,
      disableTelemetry: true,
    },
    env: (config) => ({
      ...config,
      // Weird... this function is never called (we are fine with just `viteFinal` hack for now)
      // ...getEnvironmentVariables(config.xxxx),
    }),
  };
}

export interface ViteFinalFactoryOptions {
  framework?: string;
  configToMerge?: (options: Options) => InlineConfig;
}

export function viteFinalFactory(factoryOptions?: ViteFinalFactoryOptions) {
  let storybookThemePath: string;
  let fontsPath: string;
  try {
    storybookThemePath = require.resolve('../../../../packages/dsfr-connect/dist/storybook-v7/index.css');
    fontsPath = require.resolve('../../../../packages/dsfr-connect/dist/fonts/index.css');
  } catch (error) {
    console.error(`the dsfr-connect package style must be built locally to start the storybook instance: ${error}`);

    throw error;
  }

  return async (config: InlineConfig, options: Options) => {
    config = mergeConfig(config, {
      define: {
        'process.env': getEnvironmentVariables(options.configType === 'PRODUCTION' ? 'production' : 'development'),
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: (content: string) => {
              // Only add the variables to the font file for now
              let preprendContent = `@use "${path.resolve(
                __dirname,
                `../../../../apps/docs/utils/storybook/variables.${options.configType === 'PRODUCTION' ? 'prod' : 'dev'}.scss`
              )}" as *;`;

              return `${preprendContent}\n${content}`;
            },
          },
        },
      },
      plugins: [
        pluginRequire(),
        viteStaticCopy({
          // Directly served in "development" but copied during the "production" build
          targets: [
            {
              src: `${normalizePath(path.dirname(require.resolve('@dsfrc/dsfr-connect/src/assets/.gitkeep')))}/*`,
              dest: 'assets',
            },
            {
              src: `${normalizePath(path.dirname(require.resolve('@gouvfr/dsfr/dist/favicon/favicon.ico')))}/*`,
              dest: 'assets/favicon',
            },
            {
              src: `${normalizePath(path.dirname(require.resolve('@gouvfr/dsfr/dist/fonts/Marianne-Bold.woff2')))}/*`,
              dest: 'assets/fonts',
            },
            {
              src: normalizePath(fontsPath),
              dest: 'assets/fonts',
            },
            {
              src: normalizePath(storybookThemePath),
              dest: 'assets/storybook',
            },
          ],
        }),
      ],
      resolve: {
        alias: [
          ...(factoryOptions?.framework
            ? [
                {
                  find: `@dsfrc/docs-${factoryOptions.framework}`,
                  replacement: path.resolve(__dirname, `../../../../apps/docs-${factoryOptions.framework}`),
                },
              ]
            : []),
          {
            find: '@dsfrc/docs',
            replacement: path.resolve(__dirname, '../../../../apps/docs'),
          },
          {
            find: '@dsfrc/dsfr-connect',
            replacement: path.resolve(__dirname, '../../../../packages/dsfr-connect'),
          },
          // When using SASS DSFR imports it's unable to find for example `module/string`
          // so we define here the alias (it should not conflict with other JavaScript librairies)
          {
            find: 'module',
            replacement: path.resolve(__dirname, '../../../../packages/dsfr-connect/node_modules/@gouvfr/dsfr/module'),
          },
        ],
      },
    });

    if (factoryOptions?.configToMerge) {
      config = mergeConfig(config, factoryOptions.configToMerge(options));
    }

    return config;
  };
}
