# Disqordia.space fork of pleroma-fe 

**Master** branch is the official branch, this does not contain many Disqordia.space-specific changes (icon and name changes) unless I feel its warranted

**Disqordia** branch is what you see on Disqordia.space

![Screenshot_20210613_014229](https://user-images.githubusercontent.com/84041118/121800817-d4ebb380-cbe8-11eb-82fc-4840b8e6f489.png)

## To-do list 
- [ ] Create list of all changes
- [x] Create and maintain branch without disqordia specific changes, to be used by other instance admins
- [ ] Update changelog properly
- [ ] Set a unique version scheme for this fork 
### Features 
- [x] **Add sidebar position option (merged upstream)**
- [x] Add disable instance shoutbox option
  - [x] send merge request
- [x] Add separate notifications column option
- [x] Add "Persistent floating post button" option
  - [x] send merge request upstream
- [ ] Add "Toggle media-only post viewing" in nav bar (similar to dashboard-fe or 4chan X)
- [x] Add link to edit profile if viewing your own profile
- [ ] Add option for smaller navbar in desktop view
- [ ] Add an option for silent notifications (notifications without unread indicators that you have to click away)
- [ ] Option to move shoutbox to top nav icon to save space
### Fixes 
- [x] Fixed Pleroma looking as if it's continuously loading on private instances, replaces loading circle with "Log in to view more" 
  - [ ] send merge request
### Tweaks
- [x] Add "Apply" buttons at the top of Theme settings
  - [x] send merge request
### Long-term goals
- [ ] Add an admin dashboard within pleroma-fe (similar to soapbox-fe)
- [ ] Implementation of lists
- [ ] Menu link to mute a user's domain
- [ ] Allow a user to set if their individual profile is private (similar to how "locked" works on Twitter)
- [ ] Add option for site layout similar to 4chan userscript OneeChan or AppChan X
- [ ] Add draggable resizable post form
- [ ] Add customizable sidebar links (like soapbox-fe)

## Installing this fork on your instance

``` bash
# clone the repo 
git clone https://github.com/erisdisqordia/pleroma-fe.git

# install dependencies
npm install -g yarn
yarn

# test that it works at localhost:8080
npm run dev

# build for production with minification into /dist/ folder
npm run build

# backup current static directory if needed
mv /var/lib/pleroma/static/static/js jsbackup
mv /var/lib/pleroma/static/static/css cssbackup
mv /var/lib/pleroma/static/index.html index.html.orig

# install files
cp -r dist/static/js /var/lib/pleroma/static/static/js
cp -r dist/static/css /var/lib/pleroma/static/static/css
cp dist/index.html /var/lib/pleroma/static/index.html

# Refresh your instance and it should now be running this fork!
```

# For Contributors:

You can create file `/config/local.json` (see [example](https://git.pleroma.social/pleroma/pleroma-fe/blob/develop/config/local.example.json)) to enable some convenience dev options:

* `target`: makes local dev server redirect to some existing instance's BE instead of local BE, useful for testing things in near-production environment and searching for real-life use-cases.
* `staticConfigPreference`: makes FE's `/static/config.json` take preference of BE-served `/api/statusnet/config.json`. Only works in dev mode.

FE Build process also leaves current commit hash in global variable `___pleromafe_commit_hash` so that you can easily see which pleroma-fe commit instance is running, also helps pinpointing which commit was used when FE was bundled into BE.
