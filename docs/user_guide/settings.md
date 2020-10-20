# Settings

On the top-right you will see a gear icon. Click it to open the settings.

## General

### Interface

- **Interface language** is where you can set the interface language. The default language is the one that you set in your browser settings.
- **Hide instance-specific panel** hides the panel in the lower left that usually contains general information about the server. This will only be visible if your admin has activated this panel and is deactivated by default.

### Timeline

- **Hide posts of muted users** If this is set, 'muting' a user will completely hide their posts instead of collapsing them.
- **Collapse posts with subjects** This will collapse posts that contain a subject, hiding their content. Subjects are also sometimes called content warnings.
- **Enable automatic streaming of new posts when scrolled to the top** With this enabled, new posts will automatically stream in when you are scrolled to the top. Otherwise, you will see a button on the timeline that will let you display the new posts.
- **Pause streaming when tab is not focused** This pauses the automatic streaming that the previous option enables when the tab is out of focus. This is useful if you don't want to miss any new posts.
- **Enable automatic loading when scrolled to the bottom** When this is disabled, a button will be shown on the bottom of the timeline that will let you load older posts.
- **Enable reply-link preview on hover** Status posts in the timeline and notifications contain links to replies and to the post they are a reply to. If this setting is enabled, hovering over that link will display that linked post in a small hovering overlay.

### Composing

- **Copy scope when replying** makes the scope of a reply be the same as the scope of the post it is replying to. This is useful to prevent accidentally moving private discussions to public, or vice versa.
- **Always show subject field** Whether or not to display the 'subject' input field in the post form. If you do not want to use subjects, you can deactivate this.
- **Copy subject when replying** controls if the subject of a post will be copied from the post it is replying to.
- **Post status content type** selects the default content type of your post. The options are: Plain text, HTML, BBCode and Markdown.
- **Minimize scope selection options** will reduce the visibility scopes to 'direct', your default post scope and post scope of post you're replying to.
- **Automatically hide New Post button** hides the floating "New post" button when scrolling on mobile view.
- **Pad emoji with spaces when adding from picker** Will add spaces around emoji you select it from the picker.

### Attachments

- **Hide attachments in timeline** Do not display attachments in timelines. They will still display in expanded conversations. This is useful to save bandwidth and for browsing in public.
- **Hide attachments in conversations** Also hide attachments in expanded conversations.
- **Maximum amount of thumbnails per post** Exactly that :)
- **Enable clickthrough NSFW attachment hiding** Hide attachments that are marked as NSFW/sensitive behind a click-through image.`
    - **Preload images** This will preload the hidden images so that they display faster when clicking through.
    - **Open NSFW attachments with just one click** Directly open NSFW attachments in a maximised state instead of revealing the image thumbnail.
- **Play-on-hover GIFs** With this activated, GIFs images and avatars will only be animated on mouse hover. Otherwise, they will be always animated. This is very useful if your timeline looks too flashy from people's animated avatars and eases the CPU load.
- **Loop videos** Whether to loop videos indefinitely.
    - **Loop only videos without sound** Some instances will use videos without sounds instead of GIFs. This will make only those videos autoplay.
- **Play videos directly in the media viewer** Play videos right in the timeline instead of opening it in a modal
- **Don't crop the attachment in thumbnails** if enabled, images in attachments will be fit entirely inside the container instead of being zoomed in and cropped.

### Notifications

- **Enable web push notifications** this enables Web Push notifications, to allow receiving notifications even when the page isn't opened, doesn't affect regular notifications.

### Fun

- **Meme arrows** will make `> greentext` be shown in green (using the "green" from the theme that is used).

## Profile

Here you can set up how you appear to other users among with some other settings:

- **Name** is text that displays next to your avatar in posts. Please note that you **cannot** change your *@handle*
- **Bio** will be displayed under your profile - you can put anything you want there you want for everyone to see.
- **Restrict your account to approved followers only** makes your account "locked", when people follow you - you have to approve or deny their follow requests, this gives more control over who sees your followers only posts.
- **Default visibility scope** is your default post scope for new posts
- **Strip rich text from all posts** strips rich text formatting (bold/italics/lists etc) from all incoming posts. This will only affect newly fetched posts.

If you're admin or moderator on your instance you also get **Show [role] badge in my profile** - this controls whether to show "Admin" or "Moderator** label on your profile page.

**For all options mentioned above you have to click "Submit" button for changes to take place**

- **Avatar** this changes picture next to your posts. Your avatar shouldn't exceed 2 MiB (2097152 bytes) or it could cause problems with certain instances.
- **Banner** this changes background on your profile card. Same as avatar it shouldn't exceed 2 MiB limit.
- **Profile Background** this changes background picture for UI. It isn't shown to anyone else *yet*, but some time later it will be shown when viewing your profisle.

## Security

Here you can change your password, revoke access tokens, configure 2-factor authentication (if available).

## Filtering

- **Types of notifications to show** This controls what kind of notifications will appear in notification column and which notifications to get in your system outside the web page
- **Replies in timeline** You may know that other social networks like Twitter will often not display replies to other people in your timeline, even if you are following the poster. Pleroma usually will show these posts to you to encourage conversation. If you do not like this behavior, you can change it here.
- **Hide post statistics** This hides the number of favorites, number of replies, etc.
- **Hide user statistics** This hides the number of followers, friends, etc.
- **Muted words** allows a list of words that will be muted (i.e. displayed in a collapsed state) on the timeline and in notifications. An easy way to tune down noise in your timeline. By default posts can be expanded if you want to see them.
- **Hide filtered statuses** will hide the filtered / muted posts completely instead of collapsing them.

## Theme

Here you can change the look and feel of Pleroma-FE. You can choose from several instance-provided presets and you can load one from file and save current theme to file. Before you apply new theme you can see what it will look like approximately in preview section.

The themes engine was made to be easy to use while giving an option for powerful in-depth customization - you can just tweak colors on "Common" tab and leave everything else as is.

If there's a little check box next to a color picker it means that color is optional and unless checked will be automatically picked based on some other color or defaults.

For some features you can also adjust transparency of it by changing its opacity, you just need to tick checkbox next to it, otherwise it will be using default opacity.

Contrast information is also provided - you can see how readable text is based on contrast between text color and background, icons under color pickers represent contrast rating based on [WCAG](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast) - thumbs up means AAA rating (good), half-filled circle means AA rating (acceptable) and warning icon means it doesn't pass the minimal contrast requirement and probably will be less readable, especially for vision-challenged people, you can hover over icon to see more detailed information. *Please note* that if background is not opaque (opacity != 1) contrast will be measured based on "worst case scenario", i.e. behind semi-transparent background lies some solid color that makes text harder to read, this however is still inaccurate because it doesn't account that background can be noisy/busy, making text even harder to read.

Apart from colors you can also tweak shadow and lighting, which is used mostly to give buttons proper relief based on their state, give panes their shade, make things glow etc. It's quite powerful, and basically provides somewhat convenient interface for [CSS Shadows](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow).

Another thing you can tweak is theme's roundness - some people like sharp edges, some want things more rounded. This is also used if you want circled or square avatars.

Lastly, you can redefine fonts used in UI without changing fonts in your browser or system, this however requires you to enter font's full name and having that font installed on your system.

## Notifications

This screen allows more fine-grained control over what notifications to show to you based on whom it comes from.

## Data Import/Export

This allows you to export and import a list of people you follow and block, in case instance's database gets reverted or if you want to move to another server. Note that you **CANNOT export/import list of people who *follow you***, they'll need to follow you back themselves.

## Mutes and Blocks

These screens give access to full list of people you block/mute, useful for *un*blocking/*un*muting people because blocking/muting them most likely removes them out of your sight completely.

## Version

Just displays the backend and frontend version. Useful to mention in bug reports.
