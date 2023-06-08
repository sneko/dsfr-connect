import { getColors } from '@codegouvfr/react-dsfr';

// We set our default "CDN" to ease the usage of our themes in case people does not have
// the time to manage assets on their own (always tedious), or want a solution out of the box
//
// You can override it by:
// - defining `window.DsfrConnectAssetsBaseUrl` in case of an UMD package logic
// - defining during the compilation of your application the environment variable `DSFR_CONNECT_ASSETS_BASE_URL` (or for the runtime is the application is not static)
export const assetsBaseUrl =
  typeof window !== 'undefined' && (window as any).DsfrConnectAssetsBaseUrl
    ? (window as any).DsfrConnectAssetsBaseUrl
    : process.env.DSFR_CONNECT_ASSETS_BASE_URL !== undefined
    ? process.env.DSFR_CONNECT_ASSETS_BASE_URL
    : 'https://dsfr-connect.rame.fr/main/assets/';

export const lightColors = getColors(false);
export const darkColors = getColors(true);
