# Disqordia.space fork of pleroma-fe 

Note: This contains many changes specific to Disqordia.space, such as changes to appearance, language, icons, etc.

I plan to set up a branch for use on any instance for other pleroma admins (see to-do list)

![Screenshot_20210613_014229](https://user-images.githubusercontent.com/84041118/121800817-d4ebb380-cbe8-11eb-82fc-4840b8e6f489.png)

## To-do list 
- [ ] Create list of all changes
- [ ] Create and maintain branch without disqordia specific changes, to be used by other instance admins
### Features 
- [x] **Add sidebar position option (merged upstream)**
- [x] Add disable instance shoutbox option
  - [ ] send merge request
- [x] Add separate notifications column option
- [ ] Add "Persistent floating post button" option
- [ ] Add "Toggle media-only post viewing" in nav bar (similar to dashboard-fe or 4chan X)
- [ ] Add link to edit profile if viewing your own profile
### Fixes 
- [x] Fixed Pleroma looking as if it's continuously loading on private instances, replaces loading circle with "Log in to view more" 
  - [ ] send merge request
### Tweaks
- [x] Add "Apply" buttons at the top of Theme settings
  - [ ] send merge request
### Long-term goals
- [ ] Add an admin dashboard within pleroma-fe (similar to soapbox-fe)
- [ ] Implementation of lists
- [ ] Menu link to mute a user's domain
- [ ] Allow a user to set if their individual profile is private (similar to how "locked" works on Twitter)
- [ ] Add option for site layout similar to 4chan userscript OneeChan or AppChan X
- [ ] Add draggable resizable post form

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
