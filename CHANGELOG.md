# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
## [Unreleased]
### Changed
- Greentext now has separate color slot for it
- Removed the use of with_move parameters when fetching notifications
- Push notifications now are the same as normal notfication, and are localized.
- Updated Notification Settings to match new BE API

### Fixed
- Weird bug related to post being sent seemingly after pasting with keyboard (hopefully)
- Multiple issues with muted statuses/notifications

## [Unreleased patch]
### Add
- Added private notifications option for push notifications
- 'Copy link' button for statuses (in the ellipsis menu)
- Autocomplete domains from list of known instances
- 'Bot' settings option and badge
- Added profile meta data fields that can be set in profile settings
- Added option to reset avatar/banner in profile settings
- Descriptions can be set on uploaded files before posting
- Added status preview option to preview your statuses before posting
- When a post is a reply to an unavailable post, the 'Reply to'-text has a strike-through style
- Added ability to see all favoriting or repeating users when hovering the number on highlighted statuses

### Changed
- Registration page no longer requires email if the server is configured not to require it
- Change heart to thumbs up in reaction picker
- Close the media modal on navigation events
- Add colons to the emoji alt text, to make them copyable
- Add better visual indication for drag-and-drop for files
- When disabling attachments, the placeholder links now show an icon and the description instead of just IMAGE or VIDEO etc
- Remove unnecessary options for 'automatic loading when loading older' and 'reply previews'

### Fixed
- Custom Emoji will display in poll options now.
- Status ellipsis menu closes properly when selecting certain options
- Cropped images look correct in Chrome
- Newlines in the muted words settings work again
- Clicking on non-latin hashtags won't open a new window
- Uploading and drag-dropping multiple files works correctly now.
- Subject field now appears disabled when posting
- Fix status ellipsis menu being cut off in notifications column
- Fixed autocomplete sometimes not returning the right user when there's already some results
- Videos and audio and misc files show description as alt/title properly now
- Clicking on non-image/video files no longer opens an empty modal
- Audio files can now be played back in the frontend with hidden attachments
- Videos are not cropped awkwardly in the uploads section anymore
- Reply filtering options in Settings -> Filtering now work again using filtering on server
- Don't show just blank-screen when cookies are disabled
- Add status idempotency to prevent accidental double posting when posting returns an error

## [2.0.3] - 2020-05-02
### Fixed
- Show more/less works correctly with auto-collapsed subjects and long posts
- RTL characters won't look messed up in notifications

### Changed
- Emoji autocomplete will match any part of the word and not just start, for example :drool will now helpfully suggest :blobcatdrool: and :blobcatdroolreach:

### Add
- Follow request notification support

## [2.0.2] - 2020-04-08
### Fixed
- Favorite/Repeat avatars not showing up on private instances/non-public posts
- Autocorrect getting triggered in the captcha field
- Overflow on long domains in follow/move notifications

### Changed
- Polish translation updated

## [2.0.0] - 2020-02-28
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
- Updated Pleroma default themes
- theme engine update to 3 (themes v2.1 introduction)
- massive internal changes in theme engine - slowly away from "generate things separately with spaghetti code" towards "feed all data into single 'generateTheme' function and declare slot inheritance and all in a separate file"
- Breezy theme updates to make it closer to actual Breeze in some aspects
- when using `--variable` in shadows it no longer uses the actual CSS3 variable, instead it generates color from other slots
- theme doesn't get saved to local storage when opening FE anonymously
- Captcha now resets on failed registrations
- Notifications column now cleans itself up to optimize performance when tab is left open for a long time
- 403 messaging
### Fixed
- Fixed loader-spinner not disappearing when a status preview fails to load
- anon viewers won't get theme data saved to local storage, so admin changing default theme will have an effect for users coming back to instance.
- Single notifications left unread when hitting read on another device/tab
- Registration fixed
- Deactivation of remote accounts from frontend
- Fixed NSFW unhiding not working with videos when using one-click unhiding/displaying
- Improved performance of anything that uses popovers (most notably statuses)

## [1.1.7 and earlier] - 2019-12-14
### Added
- Ability to hide/show repeats from user
- User profile button clutter organized into a menu
- Emoji picker
- Started changelog anew
- Ability to change user's email
- About page
- Added remote user redirect
- Bookmarks
### Changed
- changed the way fading effects for user profile/long statuses works, now uses css-mask instead of gradient background hacks which weren't exactly compatible with semi-transparent themes
### Fixed
- improved hotkey behavior on autocomplete popup
