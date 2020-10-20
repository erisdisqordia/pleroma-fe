# Pleroma-FE configuration and customization for instance administrators

* *For user configuration, see [Pleroma-FE user guide](../user_guide)*
* *For local development server configuration, see [Hacking, tweaking, contributing](HACKING.md)*

## Where configuration is stored

PleromaFE gets its configuration from several sources, in order of preference (the one above overrides ones below it)

1. `/api/statusnet/config.json` - this is generated on Backend and contains multiple things including instance name, char limit etc. It also contains FE/Client-specific data, PleromaFE uses `pleromafe` field of it. For more info on changing config on BE, look [here](../backend/configuration/cheatsheet.md#frontend_configurations)
2. `/static/config.json` - this is a static FE-provided file, containing only FE specific configuration. This file is completely optional and could be removed but is useful as a fallback if some configuration JSON property isn't present in BE-provided config. It's also a reference point to check what default configuration are and what JSON properties even exist. In local dev mode it could be used to override BE configuration, more about that in HACKING.md. File is located [here](https://git.pleroma.social/pleroma/pleroma-fe/blob/develop/static/config.json).
3. Built-in defaults. Those are hard-coded defaults that are used when `/static/config.json` is not available and BE-provided configuration JSON is missing some JSON properties. ( [Code](https://git.pleroma.social/pleroma/pleroma-fe/blob/develop/src/modules/instance.js) )

## Instance-defaults

Important note that some configurations are treated as "instance default" - it means user is able to change this configuration for themselves. Currently, defaults are only applied for new visitors and people who haven't changed the option in question. If you change some instance default option, there is a chance it won't affect some users.

There's currently no mechanism for user-settings synchronization across several browsers, *user* essentially means *visitor*, most user settings are stored in local storage/IndexedDB and not tied to an account in any way.

## Options

### `alwaysShowSubjectInput`
`true` - will always show subject line input, `false` - only show when it's not empty (i.e. replying). To hide subject line input completely, set it to `false` and `subjectLineBehavior` to `"noop"`

### `background`
Default image background. Be aware of using too big images as they may take longer to load. Currently image is fitted with `background-size: cover` which means "scaled and cropped", currently left-aligned. De-facto instance default, user can choose their own background, if they remove their own background, instance default will be used instead.

### `collapseMessageWithSubject`
Collapse post content when post has a subject line (content warning). Instance-default.

### `disableChat`
hides the chat (TODO: even if it's enabled on backend)

### `greentext`
Changes lines prefixed with the `>` character to have a green text color

### `hideFilteredStatuses`
Removes filtered statuses from timelines.

### `hideMutedPosts`
Removes muted statuses from timelines.

### `hidePostStats`
Hide repeats/favorites counters for posts.

### `hideSitename`
Hide instance name in header.

### `hideUserStats`
Hide followers/friends counters for users.

### `loginMethod`
`"password"` - show simple password field
`"token"` - show button to log in with external method (will redirect to login form, more details in BE documentation)

### `logo`, `logoMask`, `logoMargin`
Instance `logo`, could be any image, including svg. By default it assumes logo used will be monochrome-with-alpha one, this is done to be compatible with both light and dark themes, so that white logo designed with dark theme in mind won't be invisible over light theme, this is done via [CSS3 Masking](https://www.html5rocks.com/en/tutorials/masking/adobe/). Basically - it will take alpha channel of the image and fill non-transparent areas of it with solid color. If you really want colorful logo - it can be done by setting `logoMask` to `false`.

`logoMargin` allows you to adjust vertical margins between logo boundary and navbar borders. The idea is that to have logo's image without any extra margins and instead adjust them to your need in layout.

### `minimalScopesMode`
Limit scope selection to *Direct*, *User default* and *Scope of post replying to*. This also makes it impossible to reply to a DM with a non-DM post from PleromaFE.

### `nsfwCensorImage`
Use custom image for NSFW'd images

### `postContentType`
Default post formatting option (markdown/bbcode/plaintext/etc...)

### `redirectRootNoLogin`, `redirectRootLogin`
These two settings should point to where FE should redirect visitor when they login/open up website root

### `scopeCopy`
Copy post scope (visibility) when replying to a post. Instance-default.

### `sidebarRight`
Change alignment of sidebar and panels to the right. Defaults to `false`.

### `showFeaturesPanel`
Show panel showcasing instance features/settings to logged-out visitors

### `showInstanceSpecificPanel`
This allows you to include arbitrary HTML content in a panel below navigation menu. PleromaFE looks for an html page `instance/panel.html`, by default it's not provided in FE, but BE bundles some [default one](https://git.pleroma.social/pleroma/pleroma/blob/develop/priv/static/instance/panel.html). De-facto instance-defaults, since user can hide instance-specific panel.

### `subjectLineBehavior`
How to handle subject line (CW) when replying to a post.
* `"email"` - like EMail - prepend `re: ` to subject line if it doesn't already start with it.
* `"masto"` - like Mastodon - copy it as is.
* `"noop"` - do not copy
Instance-default.

### `theme`
Default theme used for new users. De-facto instance-default, user can change theme.

### `webPushNotifications`
Enables [PushAPI](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) - based notifications for users. Instance-default.



## Indirect configuration
Some features are configured depending on how backend is configured. In general the approach is "if backend allows it there's no need to hide it, if backend doesn't allow it there's no need to show it.

### Chat
**TODO somewhat broken, see: disableChat** chat can be disabled by disabling it in backend

### Private Mode
If the `private` instance setting is enabled in the backend, features that are not accessible without authentication, such as the timelines and search will be disabled for unauthenticated users.

### Rich text formatting in post formatting
Rich text formatting options are displayed depending on how many formatting options are enabled on backend, if you don't want your users to use rich text at all you can only allow "text/plain" one, frontend then will only display post text format as a label instead of dropdown (just so that users know for example if you only allow Markdown, only BBCode or only Plain text)

### Who to follow
This is a panel intended for users to find people to follow based on randomness or on post contents. Being potentially privacy unfriendly feature it needs to be enabled and configured in backend to be enabled.

