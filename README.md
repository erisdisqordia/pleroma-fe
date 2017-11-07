# pleroma_fe

> A single column frontend for both Pleroma and GS servers.

![screenshot](https://my.mixtape.moe/kjzioz.PNG)

# For Translators

To translate Pleroma, add your language to i18n/messages.js. Pleroma will set your language by your browser locale, but you can temporarily force it in the code by changing the locale in main.js.

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

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
