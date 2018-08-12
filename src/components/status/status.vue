<template>
  <div class="status-el" :class="[{ 'status-el_focused': isFocused }, { 'status-conversation': inlineExpanded }]">
    <template v-if="muted && !noReplyLinks">
      <div class="media status container muted">
        <small><router-link :to="{ name: 'user-profile', params: { id: status.user.id } }">{{status.user.screen_name}}</router-link></small>
        <small class="muteWords">{{muteWordHits.join(', ')}}</small>
        <a href="#" class="unmute" @click.prevent="toggleMute"><i class="icon-eye-off"></i></a>
      </div>
    </template>
    <template v-else>
      <div v-if="retweet && !noHeading" :class="[repeaterClass, { highlighted: repeaterStyle }]" :style="[repeaterStyle]" class="media container retweet-info">
        <StillImage v-if="retweet" class='avatar' :src="statusoid.user.profile_image_url_original"/>
        <div class="media-body faint">
          <a v-if="retweeterHtml" :href="statusoid.user.statusnet_profile_url" style="font-weight: bold;" :title="'@'+statusoid.user.screen_name" v-html="retweeterHtml"></a>
          <a v-else :href="statusoid.user.statusnet_profile_url" style="font-weight: bold;" :title="'@'+statusoid.user.screen_name">{{retweeter}}</a>
          <i class='fa icon-retweet retweeted'></i>
          {{$t('timeline.repeated')}}
        </div>
      </div>

      <div :class="[userClass, { highlighted: userStyle, 'is-retweet': retweet }]" :style="[ userStyle ]" class="media status">
        <div v-if="!noHeading" class="media-left">
          <a :href="status.user.statusnet_profile_url" @click.stop.prevent.capture="toggleUserExpanded">
            <StillImage class='avatar' :class="{'avatar-compact': compact}"  :src="status.user.profile_image_url_original"/>
          </a>
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
                  <router-link :to="{ name: 'user-profile', params: { id: status.user.id } }">{{status.user.screen_name}}</router-link>
                  <span v-if="status.in_reply_to_screen_name" class="faint reply-info">
                    <i class="icon-right-open"></i>
                    <router-link :to="{ name: 'user-profile', params: { id: status.in_reply_to_user_id } }">
                      {{status.in_reply_to_screen_name}}
                    </router-link>
                  </span>
                  <a v-if="isReply && !noReplyLinks" href="#" @click.prevent="gotoOriginal(status.in_reply_to_status_id)">
                    <i class="icon-reply" @mouseenter="replyEnter(status.in_reply_to_status_id, $event)" @mouseout="replyLeave()"></i>
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
              <span v-if="status.visibility"><i :class="visibilityIcon(status.visibility)"></i> </span>
              <a :href="status.external_url" target="_blank" v-if="!status.is_local" class="source_url"><i class="icon-link-ext"></i></a>
              <template v-if="expandable">
                <a href="#" @click.prevent="toggleExpanded"><i class="icon-plus-squared"></i></a>
              </template>
              <a href="#" @click.prevent="toggleMute" v-if="unmuted"><i class="icon-eye-off"></i></a>
            </div>
          </div>

          <div v-if="showPreview" class="status-preview-container">
            <status class="status-preview" v-if="preview" :noReplyLinks="true" :statusoid="preview" :compact=true></status>
            <div class="status-preview status-preview-loading" v-else>
              <i class="icon-spin4 animate-spin"></i>
            </div>
          </div>

          <div :class="{'tall-status': hideTallStatus}" class="status-content-wrapper">
            <a class="tall-status-hider" :class="{ 'tall-status-hider_focused': isFocused }" v-if="hideTallStatus" href="#" @click.prevent="toggleShowTall">Show more</a>
            <div @click.prevent="linkClicked" class="status-content media-body" v-html="status.statusnet_html"></div>
            <a v-if="showingTall" href="#" class="tall-status-unhider" @click.prevent="toggleShowTall">Show less</a>
          </div>

          <div v-if='status.attachments' class='attachments media-body'>
            <attachment :size="attachmentSize" :status-id="status.id" :nsfw="status.nsfw" :attachment="attachment" v-for="attachment in status.attachments" :key="attachment.id">
            </attachment>
          </div>

          <div v-if="!noHeading && !noReplyLinks" class='status-actions media-body'>
            <div v-if="loggedIn">
              <a href="#" v-on:click.prevent="toggleReplying">
                <i class="icon-reply" :class="{'icon-reply-active': replying}"></i>
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
        <post-status-form class="reply-body" :reply-to="status.id" :attentions="status.attentions" :repliedUser="status.user" :message-scope="status.visibility" v-on:posted="toggleReplying"/>
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
  }

  .media-heading-left {
    padding: 0;
    vertical-align: bottom;
    flex-basis: 100%;

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
      align-content: center;
    }
    .links {
      display: flex;
      padding-top: 1px;
      margin-left: 0.2em;
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
    flex-shrink: 0;
    display: flex;
    flex-wrap: nowrap;
    max-height: 1.5em;
    margin-left: 0.25em;
    .timeago {
      margin-right: 0.2em;
      font-size: 12px;
      padding-top: 1px;
    }
    i {
      margin-left: 0.2em;
    }
  }

  a {
    display: inline-block;
    word-break: break-all;
  }

  .tall-status {
    position: relative;
    height: 220px;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .tall-status-hider {
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

  .tall-status-unhider {
    width: 100%;
    text-align: center;
  }

  .status-content {
    margin-right: 0.5em;
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

    p {
      margin: 0;
      margin-top: 0.2em;
      margin-bottom: 0.5em;
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
  border-radius: $fallback--avatarAltRadius;
  border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: $fallback--avatarRadius;
  border-radius: var(--avatarRadius, $fallback--avatarRadius);
  overflow: hidden;
  position: relative;

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
  }
}

@media all and (max-width: 960px) {
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
