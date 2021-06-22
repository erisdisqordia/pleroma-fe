# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Disqordia fork changes
All fork changes by eris@disqordia.space unless indicated otherwise 
### Fixed 
- Fixed timelines appearing to constantly load when logged out if instance is set to private 
- Fixed media tab showing when logged out if instance is set to private
- Fixed follow request count on mobile showing in wrong location
### Added
- Option to change sidebar position 
- Option to hide shoutbox 
- Option for persistent new post button (normally mobile only) 
- Option to show seperate notifications column (based on [puniko's fork](https://git.pleroma.social/absturztaube/pleroma-fe))
- "Edit Profile" button when viewing your own profile
- Added icons for "Conversations" and "Staff" 
- Added Apply/Reset buttons to top of theme tab for easier theme selection
- Added option to hide follow request count in sidebar, for when you need to just make that little number go away
- Added bookmark button to posts instead of hiding in menu
- Added support for emojis (regular unicode emojis) suggestions in the shoutbox (ie :green-heart:)

### Changed
- Standardize naming of timelines in line with Mastodon/Tusky (Public -> Local, The Whole Known Network -> Public)
- Changed naming of color variable descriptions in theme tab to be more clear
- Changed icon of emoji selector to be a cute spooky ghost
- Changed icon of Interactions link to a thunderbolt (like Tumblr's activity icon), as this is separate from Notifications
- Redid top nav to include extra icons for easier navigation

# Upstream
## [Merged but unreleased]
- Added option to mark posts as sensitive by default
- Collapsable timeline menu in sidebar

## [2.3.0] - 2021-03-01
### Fixed
- Button to remove uploaded media in post status form is now properly placed and sized.
- Fixed shoutbox not working in mobile layout
- Fixed missing highlighted border in expanded conversations again
- Fixed some UI jumpiness when opening images particularly in chat view
- Fixed chat unread badge looking weird
- Fixed punycode names not working properly

### Changed
- Display 'people voted' instead of 'votes' for multi-choice polls
- Optimized chat to not get horrible performance after keeping the same chat open for a long time
- When opening emoji picker or react picker, it automatically focuses the search field
- Language picker now uses native language names
- Changed the "Timelines" link in side panel to toggle show all timeline options inside the panel
- Renamed "Timeline" to "Home Timeline" to be more clear

### Added
- Added reason field for registration when approval is required
- Group staff members by role in the About page

## [2.2.3] - 2021-01-18
### Added
- Added Report button to status ellipsis menu for easier reporting

### Fixed
- Follows/Followers tabs on user profiles now display the content properly.
- Handle punycode in screen names

### Changed
- Don't filter own posts when they hit your wordfilter


## [2.2.2] - 2020-12-22
### Added
- Mouseover titles for emojis in reaction picker
- Support to input emoji into the search box in reaction picker
- Added some missing unicode emoji
- Added the upload limit to the Features panel in the About page
- Support for solid color wallpaper, instance doesn't have to define a wallpaper anymore

### Fixed
- Fixed the occasional bug where screen would scroll 1px when typing into a reply form
- Fixed timeline errors locking timelines
- Fixed missing highlighted border in expanded conversations
- Fixed custom emoji not working in profile field names
- Fixed pinned statuses not appearing in user profiles
- Fixed some elements not being keyboard navigation friendly
- Fixed error handling when updating various profile images
- Fixed your latest chat messages disappearing when closing chat view and opening it again during the same session
- Fixed custom emoji not showing in poll options before voting
- Fixed link color not applied to instance name in topbar

### Changed
- Errors when fetching are now shown with popup errors instead of "Error fetching updates" in panel headers
- Made reply/fav/repeat etc buttons easier to hit
- Adjusted timeline menu clickable area to match the visible button
- Moved external source link from status heading to the ellipsis menu
- Disabled horizontal textarea resize
- Wallpaper is now top-aligned, horizontally centered.


## [2.2.1] - 2020-11-11
### Fixed
- Fixed regression in react popup alignment and overflowing


## [2.2.0] - 2020-11-06
### Added
- New option to optimize timeline rendering to make the site more responsive (enabled by default)
- New instance option `logoLeft` to move logo to the left side in desktop nav bar
- Import/export a muted users
- Proper handling of deletes when using websocket streaming
- Added optimistic chat message sending, so you can start writing next message before the previous one has been sent
- Added a small red badge to the favicon when there's unread notifications
- Added the NSFW alert to link previews

### Fixed
- Fixed clicking NSFW hider through status popover
- Fixed chat-view back button being hard to click
- Fixed fresh chat notifications being cleared immediately while leaving the chat view and not having time to actually see the messages
- Fixed multiple regressions in CSS styles
- Fixed multiple issues with input fields when using CJK font as default
- Fixed search field in navbar infringing into logo in some cases
- Fixed not being able to load the chat history in vertical screens when the message list doesn't take the full height of the scrollable container on the first fetch.

### Changed
- Clicking immediately when timeline shifts is now blocked to prevent misclicks
- Icons changed from fontello (FontAwesome 4 + others) to FontAwesome 5 due to problems with fontello.
- Some icons changed for better accessibility (lock, globe)
- Logo is now clickable
- Changed default logo to SVG version


## [2.1.2] - 2020-09-17
### Fixed
- Fixed chats list not updating its order when new messages come in
- Fixed chat messages sometimes getting lost when you receive a message at the same time


## [2.1.1] - 2020-09-08
### Changed
- Polls will be hidden with status content if "Collapse posts with subjects" is enabled and the post is collapsed.

### Fixed
- Network fetches don't pile up anymore but wait for previous ones to finish to reduce throttling.
- Autocomplete won't stop at the second @, so it'll still work with "@lain@l" and not start over.
- Fixed weird autocomplete behavior when you write ":custom_emoji: ?"


## [2.1.0] - 2020-08-28
### Added
- Autocomplete domains from list of known instances
- 'Bot' settings option and badge
- Added profile meta data fields that can be set in profile settings
- Added option to reset avatar/banner in profile settings
- Descriptions can be set on uploaded files before posting
- Added status preview option to preview your statuses before posting
- When a post is a reply to an unavailable post, the 'Reply to'-text has a strike-through style
- Added ability to see all favoriting or repeating users when hovering the number on highlighted statuses
- Bookmarks

### Changed
- Change heart to thumbs up in reaction picker
- Close the media modal on navigation events
- Add colons to the emoji alt text, to make them copyable
- Add better visual indication for drag-and-drop for files
- When disabling attachments, the placeholder links now show an icon and the description instead of just IMAGE or VIDEO etc
- Remove unnecessary options for 'automatic loading when loading older' and 'reply previews'
- Greentext now has separate color slot for it
- Removed the use of with_move parameters when fetching notifications
- Push notifications now are the same as normal notfication, and are localized.
- Updated Notification Settings to match new BE API

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
- Weird bug related to post being sent seemingly after pasting with keyboard (hopefully)
- Multiple issues with muted statuses/notifications

## [2.0.5] - 2020-05-12
### Added
- Added private notifications option for push notifications
- 'Copy link' button for statuses (in the ellipsis menu)

### Changed
- Registration page no longer requires email if the server is configured not to require it

### Fixed
- Status ellipsis menu closes properly when selecting certain options

## [2.0.3] - 2020-05-02
### Fixed
- Show more/less works correctly with auto-collapsed subjects and long posts
- RTL characters won't look messed up in notifications

### Changed
- Emoji autocomplete will match any part of the word and not just start, for example :drool will now helpfully suggest :blobcatdrool: and :blobcatdroolreach:

### Added
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

### Changed
- changed the way fading effects for user profile/long statuses works, now uses css-mask instead of gradient background hacks which weren't exactly compatible with semi-transparent themes

### Fixed
- improved hotkey behavior on autocomplete popup
