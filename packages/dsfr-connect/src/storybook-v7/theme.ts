// From the `.storybook/main.ts` we are unable to easily import inline CSS/SCSS
// so we deal with a static CSS file
import { assetsBaseUrl } from '../common';

export interface ManagerHeadFactoryOptions {
  storybookStylePath?: string;
  faviconFolderPath?: string;
}

export function managerHeadFactory(options?: ManagerHeadFactoryOptions) {
  return (head: string): string => {
    // We cannot rely on `assetsBaseUrl` since environment is not yet set up, we are a the
    // initialization of Storybook so we need to manage hardcoded values here too
    return `${head}
      <link rel="stylesheet" href="${options?.storybookStylePath || `${assetsBaseUrl}storybook/index.css`}">
      <link rel="apple-touch-icon" href="${options?.faviconFolderPath || assetsBaseUrl}apple-touch-icon.png" />
      <link rel="icon" href="${options?.faviconFolderPath || assetsBaseUrl}favicon.svg" type="image/svg+xml" />
      <link rel="shortcut icon" href="${options?.faviconFolderPath || assetsBaseUrl}favicon.ico" type="image/x-icon" />
      <link rel="manifest" href="${options?.faviconFolderPath || assetsBaseUrl}manifest.webmanifest" />
    `;
  };
}
