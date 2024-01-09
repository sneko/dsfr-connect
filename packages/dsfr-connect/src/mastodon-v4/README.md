# mastodo-v4

## Overview

To keep track of last Mastodon modifications we base our theme on the official one, like that there is a high probability of a good rendering even if the theme has not been implemented with new features in mind.

To rely on DSFR SASS variables we decided to provide a `.css` file at the end, because if we provide a `.scss` the user would be required to install DSFR and have admin rights on the Mastodon instance. _(Note that we investigated going from `.scss` to `.scss` to partially replace and hardcode DSFR values but it's not possible, it would require custom pre-preprocessor stuff... not worth it)_

_It should have been easy by customizing main variables in a few hours... But Mastodon theming is done a way totally unconsistent, resulting in specific variables being used for different purpose, breaking any way to make easy customization. So we ended added some workarounds... We are not glad about that but we had no other choice_ 😔

## Local development

### Get the official theme

Since our theme is based on the official one, we need to get it. We made the fetching automatic when you install dependencies of this repository (only when developing, not when installing the package from the NPM registry). But if needed you can run it a new time from `/packages/dsfr-connect` with:
`pnpm run prepare`

_Note: if you want to upgrade the official Mastodon theme, modify the version into `/packages/dsfr-connect/src/mastodon-v4/settings.ts`, delete the folder `/packages/dsfr-connect/src/mastodon-v4/mastodon/` and run again the `prepare` command._

### Launch

The easiest way to start a local instance is to use the Mastodon source code. I tried the Binami `docker-compose.yaml` and the Mastodon main one but they are not easily compatible. So instead are dealing with specific stuff for Mastodon development.

Get Mastodon outside `dsfr-connect` repository:
`git clone https://github.com/mastodon/mastodon.git`

And use to a stable version tag:
`cd mastodon && git chechout v4.2.1`

Use the IDE Visual Studio Code to open the project:
`code .`

It should suggest you to use the `Dev Containers mode locally`, accept and it will run some commands for like 5 minutes (you can see logs to see the progress). Then your Visual Studio Code transits to a "containerized workspace".

_If you have no suggestion, install the `Dev Containers` extension and restart the IDE. Or you may try to follow [direct `docker-compose` instructions](https://github.com/mastodon/mastodon#docker), but we did not succeed._

Create an admin account to modify the displayed theme:

```shell
RAILS_ENV=development bin/tootctl accounts create \
  test \
  --email test@example.com \
  --confirmed \
  --role Owner
```

**It will display a password for this account, keep it to log in.**

Note that you can change this password if you forget it in the future:

```shell
RAILS_ENV=development bin/tootctl accounts modify \
  test \
  --reset-password
```

Then we will bind your compiled custom theme to the Mastodon source code to easily commit and see modifications.

To do so we need to create the final file for the first time from `/packages/dsfr-connect`:
`pnpm run build:style`

Then bind it (make sure to define both source and target folders):

```shell
export SOURCE_FOLDER=$(pwd)/packages/dsfr-connect
export TARGET_FOLDER=/path/to/your/folder/.../mastodon

# `ln -s` for symbolic links does not work inside Docker containers easily, so doing hard links
# but they cannot apply on folders, so doing it on files into the folder (if you create a new file, don't forget to perform this)
ln -f "${SOURCE_FOLDER}/dist/mastodon-v4/index.css" "${TARGET_FOLDER}/app/javascript/styles/dsfr.css"
```

Make sure to add to your file `${TARGET_FOLDER}/config/themes.yml` the last line:

```yaml
default: styles/application.scss
contrast: styles/contrast.scss
mastodon-light: styles/mastodon-light.scss
dsfr: styles/dsfr.css
```

And recompile assets so the file is indexed to be served:
`RAILS_ENV=development OTP_SECRET=precompile_placeholder SECRET_KEY_BASE=precompile_placeholder bundle exec rails assets:precompile`

Then we need to provide the DSFR fonts so the theme can use them. Copy the folder `${SOURCE_FOLDER}/node_modules/@gouvfr/dsfr/dist/fonts` to `${TARGET_FOLDER}/public/assets/fonts`.

You are good to go! From within the `mastodon` containerized workspace in `vscode` you can run the server in development mode:
`foreman start -f Procfile.dev`

### Start theming

The DSFR theme we develop is a dedicated theme, so the first time you launch Mastodon you need to:

1. Log in with the admin account you created
2. Go to the appearance settings into `Preferences > Administration > Server settings > Appearance` (http://localhost:3000/admin/settings/appearance)
3. Switch the `Site theme` property to `dsfr`

Now you can start playing with files into `./packages/dsfr-connect/src/mastodon-v4/` by running the watching compilation since you bound the compiled file to the Mastodon containerized workspace:
`pnpm run dev:style`

_Note: switching the theme is only required the first time since settings are persisted on a Docker volume._

---

TODO: add fonts to mastodon workspace (we can use a "ln")
OR copy `packages/dsfr-connect/node_modules/@gouvfr/dsfr/dist/fonts`
into the
