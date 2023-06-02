module.exports = {
  entryPoints: ['src/index.ts'],
  out: 'docs',
  name: `${process.env.npm_package_name} _([show presentation](../README.md))_`,
  entryDocument: 'TYPINGS.md', // Name of the documentation entry
  hideBreadcrumbs: true, // Since we want a link in the name (unable to customize otherwise) we have to disable the breadcrumb otherwise it's broken
  excludeExternals: false,
  excludePrivate: true,
  excludeProtected: true,
  excludeInternal: true,
  readme: 'none', // Since we don't use GitHub pages there is no need of duplicating the `README.md`
  includeVersion: false,
  githubPages: false,
  gitRevision: 'main',
  hideGenerator: true,
};
