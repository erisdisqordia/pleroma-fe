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

Download the current zip file [here](https://github.com/erisdisqordia/pleroma-fe/raw/master/release.zip)

Back up your static folder, usually `/var/lib/pleroma/static/`: `cp -r /var/lib/pleroma/static ~/pleroma-backup`

Extract the contents to your static folder, usually `/var/lib/pleroma/static/`

This means `index.html` should be in `/var/lib/pleroma/static/index.html` and the `js` and `css` folders should be in `/var/lib/pleroma/static/static/(js/css)`

That's it!

## Removing this fork for the built in pleroma-fe

Removing is easy as the fork shouldn't touch the default pleroma-fe, so just remove what we installed:

``` bash
cd /var/lib/pleroma/static/static
rm -rf js css 
cd /var/lib/pleroma/static
rm index.html
```

# For Contributors:

You can create file `/config/local.json` (see [example](https://git.pleroma.social/pleroma/pleroma-fe/blob/develop/config/local.example.json)) to enable some convenience dev options:

* `target`: makes local dev server redirect to some existing instance's BE instead of local BE, useful for testing things in near-production environment and searching for real-life use-cases.
* `staticConfigPreference`: makes FE's `/static/config.json` take preference of BE-served `/api/statusnet/config.json`. Only works in dev mode.

FE Build process also leaves current commit hash in global variable `___pleromafe_commit_hash` so that you can easily see which pleroma-fe commit instance is running, also helps pinpointing which commit was used when FE was bundled into BE.
