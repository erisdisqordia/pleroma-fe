> Be prepared for breaking changes, unexpected behavior and this user guide becoming obsolete and wrong.

> If there was no insanity
>
> it would be necessary to create it.
>
> --Catbag

# Pleroma-FE user guide

Pleroma-FE user interface is modeled after Qvitter which is modeled after older Twitter design. It provides a simple 2-column interface for microblogging. While being simple by default it also provides many powerful customization options.

## Posting, reading, basic functions.

After registering and logging in you're presented with your timeline in right column and new post form with timeline list and notifications in the left column.

When posting links will automatically become hyperlinks, @user@instnace.tld and @user like text will become mentions with link, #tag like text will become link to a tag. Mentioning someone will notify that user that you've mentioned them, there's no way around that except for not using @ in the beginning or referring to them in some other way.

**Depending on your instance some of the options might not be available or have different defaults**

Let's clear up some basic stuff. When you post something it's called a **post** or it could be called a **status** or even a **toot** or a **prööt** depending on whom you ask. Post has body/content but it also has some other stuff in it - from attachments, visibility scope, subject line.
* **Attachments** are fairly simple - you can attach any file to a post as long as the file is within maximum size limits. If you're uploading explicit material you can mark all of your attachments as sensitive (or add `#nsfw` tag) - it will hide the images and videos behind a warning so that it won't be displayed instantly.
* **Subject line** also known as **CW** (Content Warning) could be used as a header to the post and/or to warn others about contents of the post having something that might upset somebody or something among those lines. Several applications allow to hide post content leaving only subject line visible. As a side-effect using subject line will also mark your images as sensitive (see above).
* **Visiblity scope** this one is a bit complicated. Normally all posts are `public` (and this is the *only* option on some software like GNU/Social) but if you want it, you can make it your post `unlisted` which will prevent it from showing up on *Public Timeline* and *TWKN* but AFAIK it doesn't prevent it from showing up in search. `Followers only` (sometimes referred as `fo`) posts are only visible to **your** followers, it's implied to be used in conjunction with [locking your account down to only approved followers](#user-settings) since otherwise it doesn't provide much protection since anyone would be able to follow you and read the fo posts. Another problem with fo posts is that each post is visible to followers of the user posted, so if two users are having a conversations with followers only posts you'll probably see only one side of the conversation. `Direct` posts are direct "messages", they are just regular posts but visible only to people who are mentioned in the post, so be very careful when using direct messages since if you want to mention someone else they will also receive your message, but they won't receive all previous ones. Another note of advice - direct messages could potentially be read by instance admins and attachments in DMs are visible to anyone who has a link to the attachment, so using direct messages as a *secure* method of communication is ill-advised.
* **Reply-to** if you are replying to someone, your post will also contain a note that your post is referring to the post you're replying to. Person you're replying to will receive a notification *even* if you remove them from mentioned people. You won't receive notifications when replying to your own posts, but it's useful to reply to your own posts to provide people some context if it's a follow-up to a previous post. There's a small "Reply to ..." label under post author's name which you can hover on to see what post it's referring to.

Another note: PleromaFE provides a simplified way of posting, however there a lot of stuff going on inside and some other applications allow you to tweak the inmost details of a post - for example you can set "to" and "cc" fields without actually mentioning people, so if you see a post in your notifications that's supposedly not replying to you and doesn't have you in the mentions - it's probably one of those.

#### Rich text

By default new posts you make are plaintext, meaning you can't make text **bold** or add custom links or make lists or anything like that. However if your instance allows it you can use Markdown or BBCode or HTML to spice up your text, however there are certain limitations to what HTML tags and what features of Markdown you can use.

this section will be expanded later

### Other actions

In addition to posting you can also *favorite* post also known as *liking* them and *repeat* posts (also known as *retweeting*, *boosting* and even *reprööting*). Favoriting a post increments a counter on it, notifies post author of your affection towards that post and also adds that post to your "favorited" posts list (in your own profile, "Favorites" tab). Reprööting a post does all that and also repeats this post to your followers and your profile page with a note "*user* repeated post".

You can also delete your own posts (and posts of other people if you're a moderator, but it's slightly different as it won't delete posts by people on other instances) however it's not entirely reliable since deleting a post basically sends a notification "please delete this post" and it may or may not reach all instances, as well as client applications may or may not receive deletion notification from server so post will remain until entire data is refreshed.

There's also an option to report a user via a post (if the feature is available on your instance) which could be used to notify your (and probably other instance's) admin that someone is being naughty.

## Users

When you see someone, you can click on their user picture to view their profile, and click on the userpic in that to see *full* profile. You can *follow* them, *mute* and *block* them. Following is self-explanatory, it adds them t your Home Timeline, lists you as a follower and gives you access to follower-only posts if they have any. Muting makes posts and notifications made by them very tiny, giving you an option to see the post if you're curious. However on clients other than PleromaFE their posts will be completely removed. *Blocking* a user removes them from your timeline and notifications and prevents them from following you (automatically unfollows them from you).

Please note that some users can be "locked", meaning instead of following them you send a follow request they need to approve for you to become their follower.

## Timelines

Currently you have several timelines to browse trough:
* **Timeline** aka Home Timeline - this timeline contains all posts by people you follow and your own posts
* **Interactions** all interactions you've had with people on the network, basically same as notifications except grouped in convenient way - mentions separate from favorites with repeats separate from follows
* **Direct Messages** all posts with `direct` scope addressed to you or mentioning you.
* **Public Timelines** all posts made by users on instance you're on
* **The Whole Known Network** also known as **TWKN** or **Federated Timeline** - all posts on the network by everyone, almost. Due to nature of the network your instance may not know *all** the instances on the network, so only posts originating from known instances are shown there.

## Other stuff

By default you can see **ALL** posts made by other users on your Home Timeline, this contrast behavior of Twitter and Mastodon, which shows you only non-reply posts and replies to people you follow. You can set it up to replicate the said behavior, however the option is currently broken.

You can view other people's profiles and search for users (top-right corner, person with a plus icon). Tag search is possible but not implemented properly yet, right now you can click on tag link in a post to see posts tagged with that post.

You can also view posts you've favorited on your own profile, but you cannot see favorites by other people.

Due to nature of how Pleroma (backend) operates you might see old posts appear as if they are new, this is because instance just learned about that post (i.e. your instance is younger that some other ones) and someone interacted with old post. Posts are sorted by date of when they are received, not date they have been posted because it's very easy to spoof the date, so a post claiming it "was" made in year 2077 could hand at top of your TL forever.

# Customization and configuration
TODO
