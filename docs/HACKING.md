# Hacking, tweaking, contributing

## What PleromaFE even is, how it works

PleromaFE is an SPA (Single-Page Application) backed by [Vue](https://vuejs.org/) framework. It means that it's just a nearly-empty HTML page with bunch of JavaScript that actually generates and controls DOM (i.e. html elements) in Runtime. Currently, there's no way around it - you have to have Javascript enabled in the browser to make it work, there is a theoretical possibility to generate some HTML server-side but it's not implemented yet.

You can serve static html page and everything from any HTTP(S) server but currently it will try to access /api/ path at same domain it's running on, meaning that as of right now you cannot put it on one domain and access the other without proxying requests.

Development server does exactly that - it serves static html page with javascript and all other assets, adds some code to automatically reload when changes to code are made and proxies requests to some other server.

## Setting up develop server

Setting up development server is fairly straight-forward.

1. On your system you must have **[Node.js](https://nodejs.org/) version 8** and newer installed. For older systems or systems that do not package node you can try [NodeSource](https://github.com/nodesource/distributions) repositories. *Windows support theoretically possible but isn't tested.*
2. For fetching dependencies and running basic tasks you will *[Yarn](https://yarnpkg.com/)* installed.
3. Clone the repository, `cd` into it and run `yarn` to fetch dependencies.
4. If you want to point development server at some instance you will need to copy `config/local.example.json` to `config/local.json` and change the `target` to point at instance you want, otherwise it will point to `localhost:4000` which is default address for locally-run Pleroma Backend
5. Run `yarn dev` - it will start the server.
6. Open `localhost:8080` in your browser, it might take a while initially until everything is built first time.

## Setting up production build

This could be a bit trickier, you basically need steps 1-4 from *develop build* instructions, and run `yarn build` which will compile and copy eveything needed for production into `dist` folder. As said before, this technically could be used anywhere with some details.

### Replacing your instance's frontend with custom FE build

This is the most easiest way to use and test FE build: you just need to copy or symlink contents of `dist` folder into backend's `/instance/static` folder, creating it if it doesn't exist. Be aware that running `yarn build` wipes the contents of `dist` folder.

### Running production build locally or on a separate server

This is **highly experimental** and only tried once, with no actual simple solution available yet

You will need an HTTP server that can proxy requests for `/api`, `/instance`, `/nodeinfo` and show index.html for every 404 page.

For nginx you'll probably need something like this:

```nginx
server {
  listen 80 default_server;

  index index.html index.htm index.nginx-debian.html;

  root /var/www/html

  location /api {
    proxy_pass https://example.tld;
  }

  location /instance {
    proxy_pass https://example.tld;
  }

  location /nodeinfo {
    proxy_pass https://example.tld;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

(ed. note: this is close to what i used last time i had to do it, it may not work and need additions, i basically adjusted default nginx server in debian)

## Basic architecture

### API, Data, Operations

In 99% cases PleromaFE uses [MastoAPI](https://docs.joinmastodon.org/api/) with [Pleroma Extensions](https://docs-develop.pleroma.social/differences_in_mastoapi_responses.html) to fetch the data. The rest is either QvitterAPI leftovers or pleroma-exclusive APIs. QvitterAPI doesn't exactly have documentation and uses different JSON structure and sometimes different parameters and workflows. Some pleroma-exclusive API may still be using QvitterAPI JSON structure.

PleromaFE supports both formats by transforming them into internal format which is basically QvitterAPI one with some additions and renaming. All data is passed trough [Entity Normalizer](/src/services/entity_normalizer/entity_normalizer.service.js) which can serve as a reference of API and what's actually used, it's also a host for all the hacks and data transformation.

For most part, PleromaFE tries to store all the info it can get in global vuex store - every user and post are passed trough updating mechanism where data is either added or merged with existing data, reactively updating the information throughout UI, so if in newest request user's post counter increased, it will be instantly updated in open user profile cards. This is also used to find users, posts and sometimes to build timelines and/or request parameters.

PleromaFE also tries to persist this store, however only stable data is stored, such as user authentication and preferences, user highlights. Persistence is performed by saving and loading chunk of vuex store in browser's LocalStorage/IndexedDB.

TODO: Refactor API code and document it here

### Timelines

TODO

### Themes

TODO

### Still Image

TODO

## Contributing

TODO
