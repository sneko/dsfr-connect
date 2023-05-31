import { Options, StorybookConfig } from '@storybook/types';
import path from 'path';
import { InlineConfig, mergeConfig } from 'vite';
import { normalizePath } from 'vite';
import pluginRequire from 'vite-plugin-require';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export function getConfig(framework?: string): StorybookConfig {
  const stories: string[] = [
    // Lookup wildcards should not meet a `node_modules` because due to `pnpm` symlinks everything break
    // We scoped everything in folders like `stories` and `src` in each package
    // Ref: https://github.com/storybookjs/storybook/issues/11181#issuecomment-1372243094
  ];

  // Stories from other storybooks will be listed thanks to references if launched
  if (framework) {
    stories.push(path.resolve(__dirname, `../../../../apps/docs-${framework}/stories/framework/**/*.stories.@(js|ts|jsx|tsx|mdx)`));
  } else {
    stories.push(path.resolve(__dirname, `../../../../apps/docs/stories/framework/**/*.stories.@(js|ts|jsx|tsx|mdx)`));
  }

  return {
    stories: stories,
    staticDirs: ['../public'],
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
    core: {
      enableCrashReports: false,
      disableTelemetry: true,
    },
  };
}

export function viteFinalFactory(framework?: string) {
  return async (config: InlineConfig, options: Options) => {
    return mergeConfig(config, {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@import "${path.resolve(
              __dirname,
              `../../../../apps/docs/utils/storybook/variables.${options.configType === 'PRODUCTION' ? 'prod' : 'dev'}.scss`
            )}";`,
          },
        },
      },
      plugins: [
        pluginRequire(),
        viteStaticCopy({
          // Directly served in "development" but copied during the "production" build
          targets: [
            {
              src: `${normalizePath(path.dirname(require.resolve('@gouvfr/dsfr/dist/fonts/Marianne-Bold.woff2')))}/*`,
              dest: 'assets/fonts', // Must be relative
            },
          ],
        }),
      ],
      resolve: {
        alias: [
          ...(framework
            ? [
                {
                  find: `@dsfrc/docs-${framework}`,
                  replacement: path.resolve(__dirname, `../../../../apps/docs-${framework}`),
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
  };
}
