import { DecoratorHelpers } from '@storybook/addon-styling';
import type { DecoratorFunction, Renderer } from '@storybook/types';
import { h } from 'vue';

import StoryWrapper from './StoryWrapper.vue';

const { initializeThemeState, pluckThemeFromContext, useThemeParameters } = DecoratorHelpers;

export interface DataAttributeStrategyConfiguration {
  themes: Record<string, string>;
  defaultTheme: string;
}

let previousSelected: string | null = null;

export const withVuetifyTheme = <TRenderer extends Renderer = Renderer>({
  themes,
  defaultTheme,
}: DataAttributeStrategyConfiguration): DecoratorFunction<TRenderer> => {
  initializeThemeState(Object.keys(themes), defaultTheme);

  return (story, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const { themeOverride } = useThemeParameters();

    const selected = themeOverride || selectedTheme || defaultTheme;

    // [WORKAROUND] The template below (through `StoryWrapper`)
    // is not being rerendered whereas this function is called... so we force refreshing the page
    // It may have to do with: https://stackoverflow.com/questions/68724615/vue-storybook-globaltypes-not-re-rendering-preview
    if (previousSelected && selected !== previousSelected) {
      // `import { forceReRender } from '@storybook/vue3';` was removed in v7
      window.location.reload();
    }

    previousSelected = selected;

    return () =>
      h(
        StoryWrapper as any,
        { themeName: selected, key: selected },
        {
          story: () => h((story as any)(), { ...context.args }),
        }
      );
  };
};
