// All assets to download are into this file to ease caching into the CI/CD based on source links
// (scraping and downloading them are consuming)

export const assetsUrls = {
  raw: 'https://main--ds-gouv.netlify.app/example/',
  bootstrapV5: 'https://github.com/twbs/bootstrap/archive/refs/tags/v5.3.0-alpha3.zip',
  infimaV1: 'https://github.com/facebookincubator/infima/archive/refs/tags/v0.2.0-alpha.43.zip',
  muiV5: 'https://github.com/mui/material-ui/archive/refs/tags/v5.13.4.zip',
  vuetifyV3: 'https://github.com/vuetifyjs/vuetify/archive/refs/tags/v3.3.1.zip',
};
