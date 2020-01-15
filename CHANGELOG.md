# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Added
- Icons in nav panel
- Private mode support
- Support for 'Move' type notifications
- Pleroma AMOLED dark theme
- User level domain mutes, under User Settings -> Mutes
### Changed
- Captcha now resets on failed registrations
- Notifications column now cleans itself up to optimize performance when tab is left open for a long time
- 403 messaging
### Fixed
- Single notifications left unread when hitting read on another device/tab
- Registration fixed
- Deactivation of remote accounts from frontend

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
