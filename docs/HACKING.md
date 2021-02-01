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

This is the most easiest way to use and test FE build: you just need to copy or symlink contents of `dist` folder into backend's [static directory](../backend/configuration/static_dir.md), by default it is located in `instance/static`, or in `/var/lib/pleroma/static` for OTP release installations, create it if it doesn't exist already. Be aware that running `yarn build` wipes the contents of `dist` folder.

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

In 99% cases PleromaFE uses [MastoAPI](https://docs.joinmastodon.org/api/) with [Pleroma Extensions](../backend/API/differences_in_mastoapi_responses.md) to fetch the data. The rest is either QvitterAPI leftovers or pleroma-exclusive APIs. QvitterAPI doesn't exactly have documentation and uses different JSON structure and sometimes different parameters and workflows, [this](https://twitter-api.readthedocs.io/en/latest/index.html) could be a good reference though. Some pleroma-exclusive API may still be using QvitterAPI JSON structure.

PleromaFE supports both formats by transforming them into internal format which is basically QvitterAPI one with some additions and renaming. All data is passed trough [Entity Normalizer](https://git.pleroma.social/pleroma/pleroma-fe/-/blob/develop/src/services/entity_normalizer/entity_normalizer.service.js) which can serve as a reference of API and what's actually used, it's also a host for all the hacks and data transformation.

For most part, PleromaFE tries to store all the info it can get in global vuex store - every user and post are passed trough updating mechanism where data is either added or merged with existing data, reactively updating the information throughout UI, so if in newest request user's post counter increased, it will be instantly updated in open user profile cards. This is also used to find users, posts and sometimes to build timelines and/or request parameters.

PleromaFE also tries to persist this store, however only stable data is stored, such as user authentication and preferences, user highlights. Persistence is performed by saving and loading chunk of vuex store in browser's LocalStorage/IndexedDB.

TODO: Refactor API code and document it here

### Themes

PleromaFE uses custom theme "framework" which is pretty much just a style tag rendered by vue which only contains CSS3 variables. Every color used in UI should be derived from theme. Theme is stored in a JSON object containing color, opacity, shadow and font information, with most of it being optional.

The most basic theme can consist of 4 to 8 "basic colors", which is also what previous version of themes allowed, with all other colors being derived from those basic colors, i.e. "light background" will be "background" color lightened/darkened, "panel header" will be same as "foreground". The idea is that you can specify just basic color palette and everything else will be generated automatically, but if you really need to tweak some specific color - you can.

As said before - older version only allowed 4 to 8 colors, it also used arrays instead of objects, we still support that. The basic colors are: background, foreground, text, links, red, orange, blue, green. First 4 are mandatory, last 4 have default fallbacks since ever more ancient theme formats only had 4 colors.

Note that with older version themes used different internal naming when persisting state.

Themes are meant to be backwards and somewhat forwards compatible - new colors should properly inherit from some existing one, making it compatible with older versions. When loading newer version of theme all unrecognized colors will be ignored, which for most part should be fine, however adding new features (gradients, masks, whatever it might be) might be breaky.

Lastly, pleroma provides some contrast information and generates readable text color automatically, which is done by tracking background/text color pairs and their contrast - if contrast too low it will try to use background color with inverted lightness, if it's still unacceptable it will fall back to pure black/white.

### Still Image

Most images are wrapped in a component called StillImage, which does one simple thing - tries to detect if image is a GIF and if it is (and user has enabled relevant setting) it will show `<canvas>` with that image instead of actual image. It uses standard method to render an image into canvas which renders first frame of a GIF if it's animated (obviously because canvas by itself isn't animated and you'd need to animate it yourself in JS), it will show actual image on hover. Statuses also allow playing animated avatars when you hover over a post, not just image itself.

## Contributing

Feel free to contribute, most preferred way is by starting a Merge Request in GitLab. Please try to use descriptive names for your branches and merge requests, avoid naming them "fix-issue-777" "777" and so on.
