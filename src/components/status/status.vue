<template>
  <div class="status-el" v-if="!hideReply && !deleted" :class="[{ 'status-el_focused': isFocused }, { 'status-conversation': inlineExpanded }]">
    <template v-if="muted && !noReplyLinks">
      <div class="media status container muted">
        <small>
          <router-link :to="userProfileLink">
            {{status.user.screen_name}}
          </router-link>
        </small>
        <small class="muteWords">{{muteWordHits.join(', ')}}</small>
        <a href="#" class="unmute" @click.prevent="toggleMute"><i class="button-icon icon-eye-off"></i></a>
      </div>
    </template>
    <template v-else>
      <div v-if="retweet && !noHeading" :class="[repeaterClass, { highlighted: repeaterStyle }]" :style="[repeaterStyle]" class="media container retweet-info">
        <StillImage v-if="retweet" class='avatar' :class='{ "better-shadow": betterShadow }' :src="statusoid.user.profile_image_url_original"/>
        <div class="media-body faint">
          <a v-if="retweeterHtml" :href="statusoid.user.statusnet_profile_url" class="user-name" :title="'@'+statusoid.user.screen_name" v-html="retweeterHtml"></a>
          <a v-else :href="statusoid.user.statusnet_profile_url" class="user-name" :title="'@'+statusoid.user.screen_name">{{retweeter}}</a>
          <i class='fa icon-retweet retweeted' :title="$t('tool_tip.repeat')"></i>
          {{$t('timeline.repeated')}}
        </div>
      </div>

      <div :class="[userClass, { highlighted: userStyle, 'is-retweet': retweet }]" :style="[ userStyle ]" class="media status">
        <div v-if="!noHeading" class="media-left">
          <router-link :to="userProfileLink" @click.stop.prevent.capture.native="toggleUserExpanded">
            <StillImage class='avatar' :class="{'avatar-compact': compact, 'better-shadow': betterShadow}"  :src="status.user.profile_image_url_original"/>
          </router-link>
        </div>
        <div class="status-body">
          <div class="usercard media-body" v-if="userExpanded">
            <user-card-content :user="status.user" :switcher="false"></user-card-content>
          </div>
          <div v-if="!noHeading" class="media-body container media-heading">
            <div class="media-heading-left">
              <div class="name-and-links">
                <h4 class="user-name" v-if="status.user.name_html" v-html="status.user.name_html"></h4>
                <h4 class="user-name" v-else>{{status.user.name}}</h4>
                <span class="links">
                  <router-link :to="userProfileLink">
                    {{status.user.screen_name}}
                  </router-link>
                  <span v-if="isReply" class="faint reply-info">
                    <i class="icon-right-open"></i>
                    <router-link :to="replyProfileLink">
                      {{replyToName}}
                    </router-link>
                  </span>
                  <a v-if="isReply && !noReplyLinks" href="#" @click.prevent="gotoOriginal(status.in_reply_to_status_id)" :aria-label="$t('tool_tip.reply')">
                    <i class="button-icon icon-reply" @mouseenter="replyEnter(status.in_reply_to_status_id, $event)" @mouseout="replyLeave()"></i>
                  </a>
                </span>
              </div>
              <h4 class="replies" v-if="inConversation && !noReplyLinks">
                <small v-if="replies.length">Replies:</small>
                <small class="reply-link" v-for="reply in replies">
                  <a href="#" @click.prevent="gotoOriginal(reply.id)" @mouseenter="replyEnter(reply.id, $event)" @mouseout="replyLeave()">{{reply.name}}&nbsp;</a>
                </small>
              </h4>
            </div>
            <div class="media-heading-right">
              <router-link class="timeago" :to="{ name: 'conversation', params: { id: status.id } }">
                <timeago :since="status.created_at" :auto-update="60"></timeago>
              </router-link>
              <div class="button-icon visibility-icon" v-if="status.visibility">
                <i :class="visibilityIcon(status.visibility)" :title="status.visibility | capitalize"></i>
              </div>
              <a :href="status.external_url" target="_blank" v-if="!status.is_local" class="source_url" title="Source">
                <i class="button-icon icon-link-ext-alt"></i>
              </a>
              <template v-if="expandable">
                <a href="#" @click.prevent="toggleExpanded" title="Expand">
                  <i class="button-icon icon-plus-squared"></i>
                </a>
              </template>
              <a href="#" @click.prevent="toggleMute" v-if="unmuted"><i class="button-icon icon-eye-off"></i></a>
            </div>
          </div>

          <div v-if="showPreview" class="status-preview-container">
            <status class="status-preview" v-if="preview" :noReplyLinks="true" :statusoid="preview" :compact=true></status>
            <div class="status-preview status-preview-loading" v-else>
              <i class="icon-spin4 animate-spin"></i>
            </div>
          </div>

          <div :class="{'tall-status': hideTallStatus}" class="status-content-wrapper">
            <a class="tall-status-hider" :class="{ 'tall-status-hider_focused': isFocused }" v-if="hideTallStatus" href="#" @click.prevent="toggleShowMore">Show more</a>
            <div @click.prevent="linkClicked" class="status-content media-body" v-html="status.statusnet_html" v-if="!hideSubjectStatus"></div>
            <div @click.prevent="linkClicked" class="status-content media-body" v-html="status.summary_html" v-else></div>
            <a v-if="hideSubjectStatus" href="#" class="cw-status-hider" @click.prevent="toggleShowMore">Show more</a>
            <a v-if="showingMore" href="#" class="status-unhider" @click.prevent="toggleShowMore">Show less</a>
          </div>

          <div v-if="status.attachments && !hideSubjectStatus" class="attachments media-body">
            <attachment
              class="non-gallery"
              v-for="attachment in nonGalleryAttachments"
              :size="attachmentSize"
              :nsfw="nsfwClickthrough"
              :attachment="attachment"
              :allowPlay="true"
              :setMedia="setMedia()"
              :key="attachment.id"
            />
            <gallery
              v-if="galleryAttachments.length > 0"
              :nsfw="nsfwClickthrough"
              :attachments="galleryAttachments"
              :setMedia="setMedia()"
            />
          </div>

          <div v-if="status.card && !hideSubjectStatus && !noHeading" class="link-preview media-body">
            <link-preview :card="status.card" :size="attachmentSize" :nsfw="nsfwClickthrough" />
          </div>

          <div v-if="!noHeading && !noReplyLinks" class='status-actions media-body'>
            <div v-if="loggedIn">
              <a href="#" v-on:click.prevent="toggleReplying" :title="$t('tool_tip.reply')">
                <i class="button-icon icon-reply" :class="{'icon-reply-active': replying}"></i>
              </a>
            </div>
            <retweet-button :visibility='status.visibility' :loggedIn='loggedIn' :status='status'></retweet-button>
            <favorite-button :loggedIn='loggedIn' :status='status'></favorite-button>
            <delete-button :status='status'></delete-button>
          </div>
        </div>
      </div>
      <div class="container" v-if="replying">
        <div class="reply-left"/>
        <post-status-form class="reply-body" :reply-to="status.id" :attentions="status.attentions" :repliedUser="status.user" :copy-message-scope="status.visibility" :subject="replySubject" v-on:posted="toggleReplying"/>
      </div>
    </template>
  </div>
</template>

<script src="./status.js" ></script>
<style lang="scss">
@import '../../_variables.scss';

.status-body {
  flex: 1;
  min-width: 0;
}

.status-preview.status-el {
  border-style: solid;
  border-width: 1px;
  border-color: $fallback--border;
  border-color: var(--border, $fallback--border);
}

.status-preview-container {
  position: relative;
  max-width: 100%;
}

.status-preview {
  position: absolute;
  max-width: 95%;
  display: flex;
  background-color: $fallback--bg;
  background-color: var(--bg, $fallback--bg);
  border-color: $fallback--border;
  border-color: var(--border, $fallback--border);
  border-style: solid;
  border-width: 1px;
  border-radius: $fallback--tooltipRadius;
  border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
  box-shadow: var(--popupShadow);
  margin-top: 0.25em;
  margin-left: 0.5em;
  z-index: 50;

  .status {
    flex: 1;
    border: 0;
    min-width: 15em;
  }
}

.status-preview-loading {
  display: block;
  min-width: 15em;
  padding: 1em;
  text-align: center;
  border-width: 1px;
  border-style: solid;

  i {
    font-size: 2em;
  }
}

.status-el {
  hyphens: auto;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  border-left-width: 0px;
  line-height: 18px;
  min-width: 0;
  border-color: $fallback--border;
  border-color: var(--border, $fallback--border);

  border-left: 4px $fallback--cRed;
  border-left: 4px var(--cRed, $fallback--cRed);

  &_focused {
    background-color: $fallback--lightBg;
    background-color: var(--lightBg, $fallback--lightBg);
  }

  .timeline & {
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }

  .media-body {
    flex: 1;
    padding: 0;
    margin: 0 0 0.25em 0.8em;
  }

  .usercard {
    margin-bottom: .7em
  }

  .media-heading {
    flex-wrap: nowrap;
    line-height: 18px;
  }

  .media-heading-left {
    padding: 0;
    vertical-align: bottom;
    flex-basis: 100%;

    a {
      display: inline-block;
      word-break: break-all;
    }

    small {
      font-weight: lighter;
    }
    h4 {
      white-space: nowrap;
      font-size: 14px;
      margin-right: 0.25em;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .name-and-links {
      padding: 0;
      flex: 1 0;
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;

      .user-name {
        margin-right: .45em;

        img {
          width: 14px;
          height: 14px;
          vertical-align: middle;
          object-fit: contain
        }
      }
    }

    .links {
      display: flex;
      font-size: 12px;
      color: $fallback--link;
      color: var(--link, $fallback--link);
      max-width: 100%;
      a {
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .reply-info {
      display: flex;
    }
    .replies {
      line-height: 16px;
    }
    .reply-link {
      margin-right: 0.2em;
    }
  }

  .media-heading-right {
    display: inline-flex;
    flex-shrink: 0;
    flex-wrap: nowrap;
    margin-left: .25em;
    align-self: baseline;

    .timeago {
      margin-right: 0.2em;
      font-size: 12px;
      align-self: last baseline;
    }

    > * {
      margin-left: 0.2em;
    }
    a:hover i {
      color: $fallback--text;
      color: var(--text, $fallback--text);
    }
  }

  .tall-status {
    position: relative;
    height: 220px;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .tall-status-hider {
    display: inline-block;
    word-break: break-all;
    position: absolute;
    height: 70px;
    margin-top: 150px;
    width: 100%;
    text-align: center;
    line-height: 110px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), $fallback--bg 80%);
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--bg, $fallback--bg) 80%);
    &_focused {
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), $fallback--lightBg 80%);
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--lightBg, $fallback--lightBg) 80%);
    }
  }

  .status-unhider, .cw-status-hider {
    width: 100%;
    text-align: center;
    display: inline-block;
    word-break: break-all;
  }

  .status-content {
    margin-right: 0.5em;
    font-family: var(--postFont, sans-serif);

    img, video {
      max-width: 100%;
      max-height: 400px;
      vertical-align: middle;
      object-fit: contain;
    }

    blockquote {
      margin: 0.2em 0 0.2em 2em;
      font-style: italic;
    }

    pre {
      overflow: auto;
    }

    code, samp, kbd, var, pre {
      font-family: var(--postCodeFont, monospace);
    }

    p {
      margin: 0;
      margin-top: 0.2em;
      margin-bottom: 0.5em;
    }

    h1 {
      font-size: 1.1em;
      line-height: 1.2em;
      margin: 1.4em 0;
    }

    h2 {
      font-size: 1.1em;
      margin: 1.0em 0;
    }

    h3 {
      font-size: 1em;
      margin: 1.2em 0;
    }

    h4 {
      margin: 1.1em 0;
    }
  }

  .retweet-info {
    padding: 0.4em 0.6em 0 0.6em;
    margin: 0;

    .avatar {
      border-radius: $fallback--avatarAltRadius;
      border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);
      margin-left: 28px;
      width: 20px;
      height: 20px;
    }

    .media-body {
      font-size: 1em;
      line-height: 22px;

      display: flex;
      align-content: center;
      flex-wrap: wrap;

      .user-name {
        font-weight: bold;

        img {
          width: 14px;
          height: 14px;
          vertical-align: middle;
          object-fit: contain
        }
      }

      i {
        padding: 0 0.2em;
      }

      a {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.status-fadein {
  animation-duration: 0.4s;
  animation-name: fadein;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.greentext {
  color: green;
}

.status-conversation {
  border-left-style: solid;
}

.status-actions {
  width: 100%;
  display: flex;

  div, favorite-button {
    padding-top: 0.25em;
    max-width: 6em;
    flex: 1;
  }
}

.icon-reply:hover {
  color: $fallback--cBlue;
  color: var(--cBlue, $fallback--cBlue);
}

.icon-reply.icon-reply-active {
  color: $fallback--cBlue;
  color: var(--cBlue, $fallback--cBlue);
}

.status .avatar-compact {
  width: 32px;
  height: 32px;
  box-shadow: var(--avatarStatusShadow);
  border-radius: $fallback--avatarAltRadius;
  border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);

  &.better-shadow {
    box-shadow: var(--avatarStatusShadowInset);
    filter: var(--avatarStatusShadowFilter)
  }
}

.avatar.still-image {
  width: 48px;
  height: 48px;
  box-shadow: var(--avatarStatusShadow);
  border-radius: $fallback--avatarRadius;
  border-radius: var(--avatarRadius, $fallback--avatarRadius);
  overflow: hidden;
  position: relative;

  &.better-shadow {
    box-shadow: var(--avatarStatusShadowInset);
    filter: var(--avatarStatusShadowFilter)
  }

  img {
    width: 100%;
    height: 100%;
  }

  &.animated::before {
    display: none;
  }

  &.retweeted {
  }
}

.status:hover .animated.avatar {
  canvas {
    display: none;
  }
  img {
    visibility: visible;
  }
}

.status {
  display: flex;
  padding: 0.6em;
  &.is-retweet {
    padding-top: 0.1em;
  }
}

.status-conversation:last-child {
  border-bottom: none;
}

.muted {
  padding: 0.25em 0.5em;
  button {
    margin-left: auto;
  }

  .muteWords {
    margin-left: 10px;
  }
}

a.unmute {
  display: block;
  margin-left: auto;
}

.reply-left {
  flex: 0;
  min-width: 48px;
}

.reply-body {
  flex: 1;
}

.timeline > {
  .status-el:last-child {
    border-bottom-radius: 0 0 $fallback--panelRadius $fallback--panelRadius;;
    border-radius: 0 0 var(--panelRadius, $fallback--panelRadius) var(--panelRadius, $fallback--panelRadius);
    border-bottom: none;
  }
}

@media all and (max-width: 800px) {
  .status-el {
    .retweet-info {
      .avatar {
        margin-left: 20px;
      }
    }
  }
  .status {
    max-width: 100%;
  }

  .status .avatar {
    width: 40px;
    height: 40px;
  }

  .status .avatar-compact {
    width: 32px;
    height: 32px;
  }
}

</style>
