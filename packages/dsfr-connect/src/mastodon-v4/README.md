# mastodo-v4

## Local development

### Launch

The easiest way to start a local instance is to use the Mastodon source code. I tried Binami `docker-compose.yaml` and the Mastodon main one but they are not easily compatible.

So just run:
`git clone https://github.com/mastodon/mastodon.git`

And use to a stable version tag:
`cd mastodon && git chechout v4.2.1`

Use the IDE Visual Studio Code to open the project:
`code .`

It should suggest you to use the `Dev Containers mode locally`, accept and it will run some commands for like 5 minutes (you can see logs to see the progress). Then your Visual Studio Code transits to a "containerized workspace".

_If you have no suggestion, install the `Dev Containers` extension and restart the IDE._

Create an admin account to modify the displayed theme:

```shell
RAILS_ENV=development bin/tootctl accounts create \
  test \
  --email test@example.com \
  --confirmed \
  --role Owner
```

**It will display a password for this account, keep it to log in.**

And bind your custom theme to the Mastodon source code to easily commit and see modification (make sure to define both source and target folders):

```shell
export SOURCE_FOLDER=$(pwd)/packages/dsfr-connect
export TARGET_FOLDER=/path/to/your/folder/.../mastodon
export TARGET_FOLDER=/Users/sneko/Documents/beta.gouv.fr/repos/mastodon

# `ln -s` for symbolic links does not work inside Docker containers easily, so doing hard links
# but they cannot apply on folders, so doing it on files into the folder (if you create a new file, don't forget to perform this)
ln -f "${SOURCE_FOLDER}/src/mastodon-v4/app/javascript/styles/dsfr-light.scss" "${TARGET_FOLDER}/app/javascript/styles/dsfr-light.scss"
```

From now you can run the server in development mode with:
`foreman start -f Procfile.dev`

### Start theming

The DSFR theme we develop is a dedicated theme, so the first time you launch Mastodon you need to:

1. Log in with the admin account you created
2. Go to the appearance settings (http://localhost:3000/settings/preferences/appearance)
3. Switch the `Site theme` property to `dsfr-light`

Once done you can start playing with files into `./packages/dsfr-connect/src/mastodon-v4/app/javascript/styles/` since they are mounted onto the Mastodon instance.

_Note: switching the theme is only required the first time since settings are persisted on a Docker volume._

### Update the Mastodon base theme

In case you update the Mastodon theme we base our own theme on, override `mastodon/*`, have a look in the Git status to see what has changed. If there are modifications, report structure of coloration modifications into `dsfr/*` while stripping other things.

Like that it's "easy" to catch up new base theme versions.

---

TODO: add fonts to mastodon workspace (we can use a "ln")
OR copy `packages/dsfr-connect/node_modules/@gouvfr/dsfr/dist/fonts`
into the
