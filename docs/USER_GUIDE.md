# Pleroma-FE user guide

> Be prepared for breaking changes, unexpected behavior and this user guide becoming obsolete and wrong.

> If there was no insanity
>
> it would be necessary to create it.
>
> --Catbag

## Posting, reading, basic functions.

After registering and logging in you're presented with your timeline in right column and new post form with timeline list and notifications in the left column.

Posts will contain the text you are posting, but some content will be modified:

1. Mentions: Mentions have the form of @user or @user<span></span>@instance.tld. These will become links to the user's profile. In addition, the mentioned user will always get a notification about the post they have been mentioned in, so only mention users that you want to receive this message.
2. URLs: URLs like `http://example.com` will be automatically  be turned into a clickable links.
3. Hashtags: Hashtags like #cofe will also be turned into links.

**Depending on your instance some of the options might not be available or have different defaults**

Let's clear up some basic stuff. When you post something it's called a **post** or it could be called a **status** or even a **toot** or a **prööt** depending on whom you ask. Post has body/content but it also has some other stuff in it - from attachments, visibility scope, subject line.
* **Emoji** are small images embedded in text, there are two major types of emoji: [unicode emoji](https://en.wikipedia.org/wiki/Emoji) and custom emoji. While unicode emoji are universal and standardized, they can appear differently depending on where you are using them or may not appear at all on older systems. Custom emoji are more *fun* kind - instance administrator can define many images as *custom emoji* for their users. This works very simple - custom emoji is defined by its *shortcode* and an image, so that any shortcode enclosed in colons get replaced with image if such shortcode exist.
Let's say there's `:pleroma:` emoji defined on instance. That means  
> First time using :pleroma: pleroma!  

will become  
> First time using ![pleroma](./example_emoji.png) pleroma!  

Note that you can only use emoji defined on your instance, you cannot "copy" someone else's emoji, and will have to ask your administrator to copy emoji from other instance to yours.  
Lastly, there's two convenience options for emoji: an emoji picker (smiley face to the right of "submit" button) and autocomplete suggestions - when you start typing :shortcode: it will automatically try to suggest you emoj and complete the shortcode for you if you select one. **Note** that if emoji doesn't show up in suggestions nor in emoji picker it means there's no such emoji on your instance, if shortcode doesn't match any defined emoji it will appear as text.
* **Attachments** are fairly simple - you can attach any file to a post as long as the file is within maximum size limits. If you're uploading explicit material you can mark all of your attachments as sensitive (or add `#nsfw` tag) - it will hide the images and videos behind a warning so that it won't be displayed instantly.
* **Subject line** also known as **CW** (Content Warning) could be used as a header to the post and/or to warn others about contents of the post having something that might upset somebody or something among those lines. Several applications allow to hide post content leaving only subject line visible. Using a subject line will not mark your images as sensitive, you will have to do that explicitly (see above).
* **Visiblity scope** controls who will be able to see your posts. There are four scopes available:

1. `Public`: This is the default, and some fediverse software like GNU Social only supports this. This means that your post is accessible by anyone and will be shown in the public timelines.
2. `Unlisted`: This is the same as public, but your post won't appear in the public timelines. The post will still be accessible by anyone who comes across it (for example, by looking at your profile) or by direct linking. They will also appear in public searches.
3. `Followers only`: This will show your post only to your followers. Only they will be able to interact with it. Be careful: When somebody follows you, they will be able to see all your previous `followers only` posts as well! If you want to restrict who can follow you, consider [locking your account down to only approved followers](#profle).
4. `Direct`: This will only send the message to the people explicitly mentioned in the post.

A few things to consider about the security and usage of these scopes:

- None of these options will change the fact that the messages are all saved in the database unencrypted. They will be visible to your server admin and to any other admin of a server who receives this post. Do not share information that you would consider secret or dangerous. Use encrypted messaging systems for these things.
- Follower-only posts can lead to fragmented conversations. If you post a follower-only post and somebody else replies to it with a follower-only post, only people following both of you will see the whole conversation thread. Everybody else will only see half of it. Keep this in mind and keep conversations public if possible.
- Changing scopes during a thread or adding people to a direct message will not retroactively make them see the whole conversation. If you add someone to a direct message conversation, they will not see the post that happened before they were mentioned.
* **Reply-to** if you are replying to someone, your post will also contain a note that your post is referring to the post you're replying to. Person you're replying to will receive a notification *even* if you remove them from mentioned people. You won't receive notifications when replying to your own posts, but it's useful to reply to your own posts to provide people some context if it's a follow-up to a previous post. There's a small "Reply to ..." label under post author's name which you can hover on to see what post it's referring to.

Sometimes you may encounter posts that seem different than what they are supposed to. For example, you might see a direct message without any mentions in the text. This can happen because internally, the Fediverse has a different addressing mechanism similar to email, with `to` and `cc` fields. While these are not directly accessible in PleromaFE, other software in the Fediverse might generate those posts. Do not worry in these cases, these are normal and not a bug.

#### Rich text

By default new posts you make are plaintext, meaning you can't make text **bold** or add custom links or make lists or anything like that. However if your instance allows it you can use Markdown or BBCode or HTML to spice up your text, however there are certain limitations to what HTML tags and what features of Markdown you can use.

this section will be expanded later

### Other actions

In addition to posting you can also *favorite* post also known as *liking* them and *repeat* posts (also known as *retweeting*, *boosting* and even *reprööting*). Favoriting a post increments a counter on it, notifies post author of your affection towards that post and also adds that post to your "favorited" posts list (in your own profile, "Favorites" tab). Reprööting a post does all that and also repeats this post to your followers and your profile page with a note "*user* repeated post".

Your own posts can be deleted, but this will only reliably delete the post from your own instance. Other instances will receive a deletion notice, but there's no way to force them to actually delete a post. In addition, not all instances that contain the message might even receive the deletion notice, because they might be offline or not known to have the post because they received it through a repeat. Lastly, deletion notice might not reach certain frontends and clients - post will be visible for them until page refresh or cache clear, they probably won't be able to interact with it apart from replying to it (which will have reply-to mark missing).

If you are a moderator, you can also delete posts by other people. If those people are on your instance, it will delete the post and send out the deletion notice to other servers. If they are not on your instance, it will just remove the post from your local instance.

There's also an option to report a user via a post (if the feature is available on your instance) which could be used to notify your (and probably other instance's) admin that someone is being naughty.

## Users

When you see someone, you can click on their user picture to view their profile, and click on the userpic in that to see *full* profile. You can *follow* them, *mute* and *block* them. Following is self-explanatory, it adds them t your Home Timeline, lists you as a follower and gives you access to follower-only posts if they have any. Muting makes posts and notifications made by them very tiny, giving you an option to see the post if you're curious. However on clients other than PleromaFE their posts will be completely removed. *Blocking* a user removes them from your timeline and notifications and prevents them from following you (automatically unfollows them from you).

Please note that some users can be "locked", meaning instead of following them you send a follow request they need to approve for you to become their follower.

## Timelines

Currently you have several timelines to browse trough:
* **Timeline** aka Home Timeline - this timeline contains all posts by people you follow and your own posts, as well as posts mentioning you directly.
* **Interactions** all interactions you've had with people on the network, basically same as notifications except grouped in convenient way - mentions separate from favorites with repeats separate from follows
* **Direct Messages** all posts with `direct` scope addressed to you or mentioning you.
* **Public Timelines** all posts made by users on instance you're on
* **The Whole Known Network** also known as **TWKN** or **Federated Timeline** - all posts on the network by everyone, almost. Due to nature of the network your instance may not know *all** the instances on the network, so only posts originating from known instances are shown there.

## Your profile

By clicking wrench icon above the post form you can access the profile edit or "user settings" screen.

### Profle

Here you can set up how you appear to other users among with some other settings:

- Name: this is text that displays next to your avatar in posts. Please note that you **cannot** change your *@<span></span>handle*
- Bio: this will be displayed under your profile - you can put anything you want there you want for everyone to see.
- Restrict your account to approved followers only: this makes your account "locked", when people follow you - you have to approve or deny their follow requests, this gives more control over who sees your followers only posts.
- Default visibility scope: this chooses your default post scope for new posts
- Strip rich text from all posts: this strips rich text formatting (bold/italics/lists etc) from all incoming posts. Will only affect newly fetched posts.

If you're admin or moderator on your instance you also get "Show [role] badge in my profile" - this controls whether to show "Admin" or "Moderator** label on your profile page.

**For all options mentioned above you have to click "Submit" button for changes to take place**

- Avatar: this changes picture next to your posts. Your avatar shouldn't exceed 2 MiB (2097152 bytes) or it could cause problems with certain instances.
- Banner: this changes background on your profile card. Same as avatar it shouldn't exceed 2 MiB limit.
- Profile Background: this changes background picture for UI. It isn't shown to anyone else **yet**, but some time later it will be shown when viewing your profile.

### Security

Here you can change your password, revoke access tokens, configure 2-factor authentication (if available).

### Notifications

This screen allows more fine-grained control over what notifications to show to you based on whom it comes from

### Data Import/Export

This allows you to export and import a list of people you follow, in case instance's database gets reverted or if you want to move to another server. Note that you **CANNOT export/import list of people who *follow you***, they'll just need to follow you back after you move.

### Blocks and Mutes

These screens give access to full list of people you block/mute, useful for *un*blocking/*un*muting people because blocking/muting them most likely removes them out of your sight completely.

## Other stuff

By default you can see **ALL** posts made by other users on your Home Timeline, this contrast behavior of Twitter and Mastodon, which shows you only non-reply posts and replies to people you follow. You can set it up to replicate the said behavior, however the option is currently broken.

You can view other people's profiles and search for users (top-right corner, person with a plus icon). Tag search is possible but not implemented properly yet, right now you can click on tag link in a post to see posts tagged with that post.

You can also view posts you've favorited on your own profile, but you cannot see favorites by other people.

Due to nature of how Pleroma (backend) operates you might see old posts appear as if they are new, this is because instance just learned about that post (i.e. your instance is younger that some other ones) and someone interacted with old post. Posts are sorted by date of when they are received, not date they have been posted because it's very easy to spoof the date, so a post claiming it "was" made in year 2077 could hand at top of your TL forever.

# Customization and configuration

Clicking on the cog icon in the upper right will go to the settings screen.

## General

### Interface

- Language: Here you can set the interface language. The default language is the one that you set in your browser settings.
- Hide instance-specific panel: This hides the panel in the lower left that usually contains general information about the server.

### Timeline

- Hide posts of muted users: If this is set, 'muting' a user will completely hide their posts instead of collapsing them.
- Collapse posts with subjects: This will collapse posts that contain a subject, hiding their content. Subjects are also sometimes called content warnings.
- Enable automatic streaming of new posts when scrolled to the top: With this enabled, new posts will automatically stream in when you are scrolled to the top. Otherwise, you will see a button on the timeline that will let you display the new posts.
- Pause streaming when tab is not focused: This pauses the automatic streaming that the previous option enables when the tab is out of focus. This is useful if you don't want to miss any new posts.
- Enable automatic loading when scrolled to the bottom: When this is disabled, a button will be shown on the bottom of the timeline that will let you load older posts.
- Enable reply-link preview on hover: Status posts in the timeline and notifications contain links to replies and to the post they are a reply to. If this setting is enabled, hovering over that link will display that linked post in a small hovering overlay.

### Composing

- Copy scope when replying: When this is activated, the scope of a reply will be the same as the scope of the post it is replying to. This is useful to prevent accidentally moving private discussions to public, or vice versa.
- Always show subject field: Whether or not to display the 'subject' input field in the post form. If you do not want to use subjects, you can deactivate this.
- Copy subject when replying: This controls if the subject of a post will be copied from the post it is replying to.
- Post status content type: Selects the default content type of your post. The options are: Plain text, HTML, BBCode and Markdown.
- Minimize scope selection options: Selecting this will reduce the visibility scopes to 'direct', your default post scope and post scope of post you're replying to.
- Automatically hide New Post button: Mobile interface only: hide floating "New post" button when scrolling

### Attachments

- Hide attachments in timeline: Do not display attachments in timelines. They will still display in expanded conversations. This is useful to save bandwidth and for browsing in public.
- Hide attachments in conversations: Also hide attachments in expanded conversations.
- Maximum amount of thumbnails per post: Exactly that :)
- Enable clickthrough NSFW attachment hiding: Hide attachments that are marked as NSFW/sensitive behind a click-through image.`
- Preload images: This will preload the hidden images so that they display faster when clicking through.
- Open NSFW attachments with just one click: Directly open NSFW attachments in a maximised state instead of revealing the image thumbnail.
- Play-on-hover GIFs: With this activated, GIFs images and avatars will only be animated on mouse hover. Otherwise, they will be always animated. This is very useful if your timeline looks too flashy from people's animated avatars and eases the CPU load.
- Loop videos: Whether to loop videos indefinitely.
- Loop only videos without sound: Some instances will use videos without sounds instead of GIFs. This will make only those videos autoplay.
- Play videos directly in the media viewer: Play videos right in the timeline instead of opening it in a modal
- Don't crop the attachment in thumbnails: if enabled, images in attachments will be fit entirely inside the container instead of being zoomed in and cropped.

### Notifications

- Enable web push notifications: this enables Web Push notifications, to allow receiving notifications even when the page isn't opened, doesn't affect regular notifications.

## Theme

You can change the look and feel of Pleroma Frontend here. You can choose from several instance-provided presets and you can load one from file and save current theme to file. Before you apply new theme you can see what it will look like approximately in preview section.

Themes engine was made to be easy to use while giving an option for powerful in-depth customization - you can just tweak colors on "Common" tab and leave everything else as is.

If there's a little check box next to a color picker it means that color is optional and unless checked will be automatically picked based on some other color or defaults.

For some features you can also adjust transparency of it by changing its opacity, you just need to tick checkbox next to it, otherwise it will be using default opacity.

Contrast information is also provided - you can see how readable text is based on contrast between text color and background, icons under color pickers represent contrast rating based on [WCAG](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast) - thumbs up means AAA rating (good), half-filled circle means AA rating (acceptable) and warning icon means it doesn't pass the minimal contrast requirement and probably will be less readable, especially for vision-challenged people, you can hover over icon to see more detailed information. *Please note* that if background is not opaque (opacity != 1) contrast will be measured based on "worst case scenario", i.e. behind semi-transparent background lies some solid color that makes text harder to read, this however is still inaccurate because it doesn't account that background can be noisy/busy, making text even harder to read.

Apart from colors you can also tweak shadow and lighting, which is used mostly to give buttons proper relief based on their state, give panes their shade, make things glow etc. It's quite powerful, and basically provides somewhat convenient interface for [CSS Shadows](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow).

Another thing you can tweak is theme's roundness - some people like sharp edges, some want things more rounded. This is also used if you want circled or square avatars.

Lastly, you can redefine fonts used in UI without changing fonts in your browser or system, this however requires you to enter font's full name and having that font installed on your system.

## Filtering

- Types of notifications to show: This controls what kind of notifications will appear in notification column and which notifications to get in your system outside the web page
- Replies in timeline: You may know that other social networks like Twitter will often not display replies to other people in your timeline, even if you are following the poster. Pleroma usually will show these posts to you to encourage conversation. If you do not like this behavior, you can change it here.
- Hide post statistics: This hides the number of favorites, number of replies, etc.
- Hide user statistics: This hides the number of followers, friends, etc.
- Muted words: A list of words that will be muted (i.e. displayed in a collapsed state) on the timeline and in notifications. An easy way to tune down noise in your timeline. Posts can always be expanded when you actually want to see them.
- Hide filtered statuses: Selecting this will hide the filtered / muted posts completely instead of collapsing them.


## Version

Just displays the backend and frontend version. Useful to mention in bug reports.
