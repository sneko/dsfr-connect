import dsfrStyle from '@gouvfr/dsfr/dist/dsfr/dsfr.min.css?inline';
import moduleDsfrScript from '@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js?raw';
import noModuleDsfrScript from '@gouvfr/dsfr/dist/dsfr/dsfr.nomodule.min.js?raw';
import dsfrUtilityStyle from '@gouvfr/dsfr/dist/utility/utility.min.css?inline';
import { Meta, StoryFn } from '@storybook/html';

import { withDsfrTheme } from '@dsfrc/docs/utils/decorators';

import componentHtml from './index.html?raw';

export default {
  title: 'gallery/{{framework}}/{{component}}',
  decorators: [
    (story) => {
      // Import the style and script here to not pollute other framework stories
      const styleElement = document.createElement('style');
      styleElement.textContent = dsfrStyle;
      const utilityStyleElement = document.createElement('style');
      utilityStyleElement.textContent = dsfrUtilityStyle;

      const moduleScriptElement = document.createElement('script');
      moduleScriptElement.type = 'module';
      moduleScriptElement.async = false;
      moduleScriptElement.innerHTML = moduleDsfrScript;
      const noModuleScriptElement = document.createElement('script');
      noModuleScriptElement.noModule = true;
      noModuleScriptElement.async = false;
      // Disabling for now since having it results in the following error (note it does not happen if imported globally and injectd inline):
      // "[object Undefined]is not a function."
      // noModuleScriptElement.innerHTML = noModuleDsfrScript;

      return `${styleElement.outerHTML}${utilityStyleElement.outerHTML}${story()}${moduleScriptElement.outerHTML}${noModuleScriptElement.outerHTML}`;
    },
    withDsfrTheme({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
  parameters: {
    storySource: {
      source: componentHtml,
    },
  },
  render: ({ label, ...args }) => {
    return componentHtml;
  },
} as Meta<any>;

export const Default = {} as StoryFn<any>;
