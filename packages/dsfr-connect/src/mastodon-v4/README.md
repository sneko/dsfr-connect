# mastodo-v4

## Local development

### Launch

In the `./packages/dsfr-connect/src/mastodon-v4/` directory, just run:
`docker-compose up`

Once done, go to [http://localhost/](http://localhost/) to start using your local instance.

### Admin access

You can log in with admin credentials:

- Email: `user@bitnami.org`
- Password: `bitnami1`

### Start theming

The DSFR theme we develop is a dedicated theme, so the first time you launch Mastodon you need:

1. To log in with the admin account
2. Go to the appearance settings (http://localhost/settings/preferences/appearance)
3. Switch the `Site theme` property to `dsfr-light`

Once done you can start playing with files into `./packages/dsfr-connect/src/mastodon-v4/app/javascript/styles/` since they are mounted onto the Mastodon instance.

_Note: switching the theme is only required the first time since settings are persisted on a Docker volume._
