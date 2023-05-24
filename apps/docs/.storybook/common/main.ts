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
    stories.push(path.resolve(__dirname, `../../../../apps/docs/stories/frameworks/${framework}/**/*.stories.@(js|ts|jsx|tsx|mdx)`));
  } else {
    stories.push(path.resolve(__dirname, `../../../../apps/docs/stories/frameworks/raw/**/*.stories.@(js|ts|jsx|tsx|mdx)`));
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
      cacheDir: path.resolve(__dirname, `../../node_modules/.cache/.vite-storybook-${framework || 'main'}`), // Using the default "node_modules/.cache/.vite-storybook" breaks since we use concurrent Storybooks at the same time
      plugins: [pluginRequire()],
      resolve: {
        alias: [
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
