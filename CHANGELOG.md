# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Added
- Tons of color slots including ones for hover/pressed/toggled buttons
- Experimental `--variable[,mod]` syntax support for color slots in themes. the `mod` makes color brighter/darker depending on background color (makes darker color brighter/darker depending on background color)
- Paper theme by Shpuld
- Icons in nav panel
- Private mode support
- Support for 'Move' type notifications
- Pleroma AMOLED dark theme
- User level domain mutes, under User Settings -> Mutes
- Emoji reactions for statuses
- MRF keyword policy disclosure
### Changed
- theme engine update to 3 (themes v2.1 introduction)
- massive internal changes in theme engine - slowly away from "generate things separately with spaghetti code" towards "feed all data into single 'generateTheme' function and declare slot inheritance and all in a separate file"
- Breezy theme updates to make it closer to actual Breeze in some aspects
- when using `--variable` in shadows it no longer uses the actual CSS3 variable, instead it generates color from other slots
- theme doesn't get saved to local storage when opening FE anonymously
- Captcha now resets on failed registrations
- Notifications column now cleans itself up to optimize performance when tab is left open for a long time
- 403 messaging
### Fixed
- anon viewers won't get theme data saved to local storage, so admin changing default theme will have an effect for users coming back to instance.
- Single notifications left unread when hitting read on another device/tab
- Registration fixed
- Deactivation of remote accounts from frontend
- Fixed NSFW unhiding not working with videos when using one-click unhiding/displaying

## [1.1.7 and earlier] - 2019-12-14
### Added
- Ability to hide/show repeats from user
- User profile button clutter organized into a menu
- Emoji picker
- Started changelog anew
- Ability to change user's email
- About page
- Added remote user redirect
### Changed
- changed the way fading effects for user profile/long statuses works, now uses css-mask instead of gradient background hacks which weren't exactly compatible with semi-transparent themes
### Fixed
- improved hotkey behavior on autocomplete popup
