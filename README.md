# pleroma_fe

> A single column frontend for both Pleroma and GS servers.

![screenshot](https://i.imgur.com/DJVqSJ0.png)

# For Translators

To translate Pleroma-FE, add your language to [src/i18n/messages.js](https://git.pleroma.social/pleroma/pleroma-fe/blob/develop/src/i18n/messages.js). Pleroma-FE will set your language by your browser locale, but you can temporarily force it in the code by changing the locale in main.js.

# FOR ADMINS

You don't need to build Pleroma-FE yourself. Those using the Pleroma backend will be able to use it out of the box.
For the GNU social backend, check out https://git.pleroma.social/pleroma/pleroma-fe/wikis/dual-boot-with-qvitter to see how to run Pleroma-FE and Qvitter at the same time.

## Build Setup

``` bash
# install dependencies
npm install -g yarn
yarn

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit
```

# For Contributors:

You can create file `/config/local.json` (see [example](https://git.pleroma.social/pleroma/pleroma-fe/blob/develop/config/local.example.json)) to enable some convenience dev options:

* `target`: makes local dev server redirect to some existing instance's BE instead of local BE, useful for testing things in near-production environment and searching for real-life use-cases.
* `staticConfigPreference`: makes FE's `/static/config.json` take preference of BE-served `/api/statusnet/config.json`. Only works in dev mode.

FE Build process also leaves current commit hash in global variable `___pleromafe_commit_hash` so that you can easily see which pleroma-fe commit instance is running, also helps pinpointing which commit was used when FE was bundled into BE.

# Configuration

Edit config.json for configuration. scopeOptionsEnabled gives you input fields for CWs and the scope settings.

## Options

### Login methods

```loginMethod``` can be set to either ```password``` (the default) or ```token```, which will use the full oauth redirection flow, which is useful for SSO situations.
