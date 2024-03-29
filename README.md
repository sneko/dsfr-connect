# dsfr-connect

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

This library will help you in theming your favorite UI framework to look like the official DSFR as much as possible (https://github.com/GouvernementFR/dsfr). Our Storybook expands on how to integrate this library but also why using main UI frameworks can help. Also, it shows a real preview of each framework components themed:

🎨 https://dsfr-connect.rame.fr

## Contribute

This monorepository is managed with `pnpm`, have it installed and run:

```
pnpm install
```

### Improve themes

Then you can launch all framework Storybooks with:

```bash
cd apps/docs
pnpm cli prepare
pnpm cli dev
```

_(if you want to launch just the raw DSFR and a specific framework you can use `pnpm cli dev -f bootstrap-v5`)_

Since technically we were required to have each framework version in a separate NPM package (and so a separate Storybook), we have developed the `apps/docs/scripts/cli.ts` script to manage all actions at once easily.

### Add a new framework or a new major framework version

Try to mimic what's already done for the frameworks in place, roughly the logic is the same for all:

1. download the framework documentation _(see `apps/docs/scripts/*/` to reuse some logic)_
2. extract all code sections
3. transform them to stories thanks to templating
4. provide the theme through files like:
   - `.scss` and `.css` if the framework styling is done this way (the `.css` version will help people who have websites like Wordpress or so, when they cannot use preprocessing)
   - `.ts` for theme getters for framework to be styled through JavaScript
   - `.json` that should be a raw result of the `.ts` getters so people in other languages (Python...) would be able to parse it easily

They must be shipped into the final bundle so people can easily use a service like https://www.unpkg.com/ to access files as a CDN without much burden.

_Note: if your framework has a dark mode version, don't forget to theme it! Note that our Storybooks has an addon to switch the dark mode._

### Any doubt?

Post an issue or contact us through the livechat module on our Storybook.

## Technical setup of this repository

### Apps & Actions

- [CodeCov](https://github.com/marketplace/codecov): code coverage reports _(we have CodeQL in addition in the CI/CD... pick just one in the future)_

#### Environments

You must configure 2 environments in the CI/CD settings:

- `global` (to restrict to `dev` and `main` branches only)
- `dev` (to restrict to `dev` branch only)
- `prod` (to restrict to `main` branch only)

### Secrets

The following ones must be repository secrets (not environment ones):

- `NPM_TOKEN`: [SECRET]
- `NETLIFY_AUTH_TOKEN`: [SECRET]
- `NETLIFY_SITE_ID`: [SECRET]
- `CRISP_WEBSITE_ID`: [SECRET]

### Default branch

The default branch is `dev`.

### Branch protection rules

1.  Pattern: `main`
    Checked:

    - Require status checks to pass before merging
    - Do not allow bypassing the above settings

2.  Pattern: `dev`
    Checked:

    - Require linear history
    - Do not allow bypassing the above settings
    - Allow force pushes (+ "Specify who can force push" and leave for administrators)

### Hosting & domain

We managed to have all Storybooks static in the same folder and we chose Netlify to host it. Just configure the 2 environments variables you can find from the Netlify interface and you're good to go!

_Note: you can add a custom domain easily_

### Crisp

Crisp is used as a livechat to facilitate communication with people not used to GitHub issues.

From their interface we create a website named: `dsfr-connect`

Then upload as the icon the one used for the DSFR website (usually `apple-touch-icon.png` has enough quality).

Into the `Chatbox & Email settings` section go to `Chat Appearance` and set:

- Color theme (chatbot color): `Red`
- Chatbox background (message texture): `Default (No background)`

Then go to `Chatbox Security` and enable `Lock the chatbox to website domain (and subdomains)` (not need to enable it inside the development environment).

### IDE

Since the most used IDE as of today is Visual Studio Code we decided to go we it. Using it as well will make you benefit from all the settings we set for this project.

#### Manual steps

Every settings should work directly when opening the project with `vscode`, except for TypeScript.

Even if your project uses a TypeScript program located inside your `node_modules`, the IDE generally uses its own. Which may imply differences since it's not the same version. We do recommend using the exact same, for this it's simple:

1. Open a project TypeScript file
2. Open the IDE command input
3. Type `TypeScript` and click on the item `TypeScript: Select TypeScript Version...`
4. Then select `Use Workspace Version`

In addition, using the workspace TypeScript will load `compilerOptions.plugins` specified in your `tsconfig.json` files, which is not the case otherwise. Those plugins will bring more confort while developing!

[build-img]: https://github.com/sneko/dsfr-connect/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/sneko/dsfr-connect/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/dsfr-connect
[downloads-url]: https://www.npmtrends.com/dsfr-connect
[npm-img]: https://img.shields.io/npm/v/dsfr-connect
[npm-url]: https://www.npmjs.com/package/dsfr-connect
[issues-img]: https://img.shields.io/github/issues/sneko/dsfr-connect
[issues-url]: https://github.com/sneko/dsfr-connect/issues
[codecov-img]: https://codecov.io/gh/sneko/dsfr-connect/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/sneko/dsfr-connect
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
