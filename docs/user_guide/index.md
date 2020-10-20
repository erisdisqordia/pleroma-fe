# General overview

> Be prepared for breaking changes, unexpected behavior and this user guide becoming obsolete and wrong.

> If there was no insanity
>
> it would be necessary to create it.
>
> --Catbag

Pleroma-FE is the default user-facing frontend for Pleroma. If your instance uses Pleroma-FE, you can access it by going to your instance (e.g. <https://pleroma.soykaf.com>). After logging in you will have two columns in front of you. Here we're going to keep it to the default behaviour, but some instances swap the left and right columns. If you're on such an instance what we refer to as the left column will be on your right and vice versa.

### Left column

- first block: This section is dedicated to [posting](posting_reading_basic_functions.md)
- second block: Here you can switch between the different views for the right column.
- Optional third block: This is the Instance panel that can be activated, but is deactivated by default. It's fully customisable by instance admins and by default has links to the Pleroma-FE and Mastodon-FE.
- fourth block: This is the Notifications block, here you will get notified whenever somebody mentions you, follows you, repeats or favorites one of your statuses

### Right column
This is where the interesting stuff happens! There are different views depending on what you choose in the second block of the left panel.

- **Timelines** Depending on the [timeline](timelines.md) you will see different statuses, but each status has a standard structure:
    - Profile pic, name and link to profile. An optional left-arrow if it's a reply to another status (hovering will reveal the reply-to status). Clicking on the profile pic will uncollapse the user's profile where you can find information about the account and can [follow, mute or block the account](users_follow_mute_block.md).
    - An arrow icon on the right side allows you to open the status on the instance where it's originating from.
    - A `+` button on the rightmost side allows you to Expand/Collapse an entire discussion thread.
    - The text of the status, including mentions and attachments. If you click on a mention, it will automatically open the profile page of that person.
    - Four buttons (left to right): Reply, Repeat, Favorite and Add Reaction. The three dots next to it are a dropdown menu for extra options including simple moderation, bookmarking, deleting posts, pinning your own posts to your profile and more.
- **Interactions** shows all interactions you've had with people on the network, basically same as notifications except grouped in convenient way.
- **Chats** is the chat feature. You can find your friends and start chatting with them. At the moment chat are only one-on-one, but once groups are introduced groupchats will also be possible.
- **About** is the about-page and lists the staff, the TOS, activated MRF's, and enabled features

### Top right

- The magnifier icon opens the search screen
    - You can search for statuses, people and hashtags.
    - You can import statuses from remote servers by pasting the url to the post in the search field.
    - If you want to search for users that your instance doesn't know about yet, you can search for them using the full `name@instance.tld` handle. You can also use the full url from their remote profile.
- The gear icon gives you [settings](settings.md)
- If you have admin rights, you'll see an icon that opens the admin interface
- The last icon is to log out

### Bottom right
On the bottom right you have the Shoutbox. Here you can communicate with people on the same instance in realtime. It is local-only, very basic and will most probably be removed once the Chats functionality allows group chats.
