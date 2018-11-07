# pleroma_fe

> A single column frontend for both Pleroma and GS servers.

![screenshot](https://i.imgur.com/DJVqSJ0.png)

# For Translators

To translate Pleroma, add your language to [src/i18n/messages.js](https://git.pleroma.social/pleroma/pleroma-fe/blob/develop/src/i18n/messages.js). Pleroma will set your language by your browser locale, but you can temporarily force it in the code by changing the locale in main.js.

# FOR ADMINS

You don't need to build Pleroma yourself. Check out https://git.pleroma.social/pleroma/pleroma-fe/wikis/dual-boot-with-qvitter to see how to run Pleroma and Qvitter at the same time.

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

# Configuration

Edit config.json for configuration. scopeOptionsEnabled gives you input fields for CWs and the scope settings.

## Options

### Login methods

```loginMethod``` can be set to either ```password``` (the default) or ```token```, which will use the full oauth redirection flow, which is useful for SSO situations.
