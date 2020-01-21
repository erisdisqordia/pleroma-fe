# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Added
- Ability to hide/show repeats from user
- User profile button clutter organized into a menu
- Emoji picker
- Started changelog anew
- Ability to change user's email
- About page
### Changed
- theme engine update to 3
- theme doesn't get saved to local storage when opening FE anonymously
- changed the way fading effects for user profile/long statuses works, now uses css-mask instead of gradient background hacks which weren't exactly compatible with semi-transparent themes
### Fixed
- anon viewers won't get theme data saved to local storage, so admin changing default theme will have an effect for users coming back to instance.
- improved hotkey behavior on autocomplete popup
