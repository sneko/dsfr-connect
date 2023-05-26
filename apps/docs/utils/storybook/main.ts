import { Options, StorybookConfig } from '@storybook/types';
import path from 'path';
import { InlineConfig, mergeConfig } from 'vite';
import pluginRequire from 'vite-plugin-require';

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
      plugins: [pluginRequire()],
      resolve: {
        alias: [
          ...(!!framework
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
        ],
      },
    });
  };
}
