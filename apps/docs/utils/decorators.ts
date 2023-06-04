import { DecoratorHelpers } from '@storybook/addon-styling';
import type { DecoratorFunction, Renderer } from '@storybook/types';

const { initializeThemeState, pluckThemeFromContext, useThemeParameters } = DecoratorHelpers;

export interface DataAttributeStrategyConfiguration {
  themes: Record<string, string>;
  defaultTheme: string;
}

// Custom theme switch since `@storybook/addon-styling` is not compatible with the DSFR logic
export const withDsfrTheme = <TRenderer extends Renderer = Renderer>({
  themes,
  defaultTheme,
}: DataAttributeStrategyConfiguration): DecoratorFunction<TRenderer> => {
  initializeThemeState(Object.keys(themes), defaultTheme);

  return (story, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const { themeOverride } = useThemeParameters();

    const selected = themeOverride || selectedTheme || defaultTheme;

    document.documentElement.dataset.theme = selected;
    document.documentElement.dataset.frTheme = selected;
    document.documentElement.dataset.frScheme = selected;

    return story();
  };
};
