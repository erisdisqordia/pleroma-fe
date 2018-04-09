<template>
  <div class="status-el base00-background base03-border" :class="[{ 'base01-background': isFocused }, { 'status-conversation': inlineExpanded }]">
    <template v-if="muted && !noReplyLinks">
      <div class="media status container muted">
        <small><router-link :to="{ name: 'user-profile', params: { id: status.user.id } }">{{status.user.screen_name}}</router-link></small>
        <small class="muteWords">{{muteWordHits.join(', ')}}</small>
        <a href="#" class="unmute" @click.prevent="toggleMute"><i class="base09 icon-eye-off"></i></a>
      </div>
    </template>
    <template v-else>
      <div v-if="retweet && !noHeading" class="media container retweet-info">
        <StillImage v-if="retweet" class='avatar' :src="statusoid.user.profile_image_url_original"/>
        <div class="media-body base04">
          <a :href="statusoid.user.statusnet_profile_url" style="font-weight: bold;" :title="'@'+statusoid.user.screen_name">{{retweeter}}</a>
          <i class='fa icon-retweet retweeted'></i>
          {{$t('timeline.repeated')}}
        </div>
      </div>

      <div class="media status">
        <div v-if="!noHeading" class="media-left">
          <a :href="status.user.statusnet_profile_url" @click.stop.prevent.capture="toggleUserExpanded">
            <StillImage class='avatar' :class="{'avatar-compact': compact}"  :src="status.user.profile_image_url_original"/>
          </a>
        </div>
        <div class="status-body">
          <div class="base03-border usercard media-body" v-if="userExpanded">
            <user-card-content :user="status.user" :switcher="false"></user-card-content>
          </div>
          <div v-if="!noHeading" class="media-body container">
            <div class="media-heading-left">
              <div class="name-and-links">
                <h4 class="user-name">{{status.user.name}}</h4>
                <span class="links">
                  <router-link :to="{ name: 'user-profile', params: { id: status.user.id } }">{{status.user.screen_name}}</router-link>
                  <span v-if="status.in_reply_to_screen_name"> &gt;
                    <router-link :to="{ name: 'user-profile', params: { id: status.in_reply_to_user_id } }">
                      {{status.in_reply_to_screen_name}}
                    </router-link>
                  </span>
                  <a v-if="isReply && !noReplyLinks" href="#" @click.prevent="gotoOriginal(status.in_reply_to_status_id)">
                    <i class="icon-reply base09" @mouseenter="replyEnter(status.in_reply_to_status_id, $event)" @mouseout="replyLeave()"></i>
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
              <a :href="status.external_url" target="_blank" v-if="!status.is_local" class="source_url"><i class="base09 icon-binoculars"></i></a>
              <template v-if="expandable">
                <a href="#" @click.prevent="toggleExpanded"><i class="base09 icon-plus-squared"></i></a>
              </template>
              <a href="#" @click.prevent="toggleMute" v-if="unmuted"><i class="base09 icon-eye-off"></i></a>
            </div>
          </div>

          <div v-if="showPreview" class="status-preview-container">
            <status class="status-preview" v-if="preview" :noReplyLinks="true" :statusoid="preview" :compact=true></status>
            <div class="status-preview status-preview-loading base00-background base03-border" v-else>
              <i class="base09 icon-spin4 animate-spin"></i>
            </div>
          </div>

          <div :class="{'tall-status': hideTallStatus}" class="status-content-wrapper">
            <a class="tall-status-hider" :style="hiderStyle" v-if="hideTallStatus" href="#" @click.prevent="toggleShowTall">Show more</a>
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
                <i class="base09 icon-reply" :class="{'icon-reply-active': replying}"></i>
              </a>
            </div>
            <retweet-button :loggedIn='loggedIn' :status='status'></retweet-button>
            <favorite-button :loggedIn='loggedIn' :status='status'></favorite-button>
            <delete-button :status='status'></delete-button>
          </div>
        </div>
      </div>
      <div class="container" v-if="replying">
        <div class="reply-left"/>
        <post-status-form class="reply-body" :reply-to="status.id" :attentions="status.attentions" :repliedUser="status.user" v-on:posted="toggleReplying"/>
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
}

.status-preview-container {
  position: relative;
  max-width: 100%;
}

.status-preview {
  position: absolute;
  max-width: 95%;
  display: flex;
  border-radius: 4px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
  margin-top: 0.5em;
  margin-left: 1em;
  z-index: 50;
  .status {
    flex: 1;
    border: 0;
  }
}

.status-preview-loading {
  display: block;
  font-size: 2em;
  min-width: 8em;
  padding: 0.5em;
  text-align: center;
  border-width: 1px;
  border-style: solid;
}

.status-el {
  hyphens: auto;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  border-left-width: 0px;
  line-height: 18px;
  min-width: 0;

  .timeline & {
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }

  .media-body {
    flex: 1;
    padding: 0;
    margin: 0 0 0.25em 0.8em;
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
      font-size: 14px;
      margin-right: 0.25em;
    }
    .name-and-links {
      padding: 0;
      flex: 1 0;
      display: flex;
      flex-wrap: wrap;
    }
    .links {
      padding-top: 1px;
      font-size: 12px;
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
    padding: 0.3em 0.6em 0 0.6em;
    margin: 0 0 -0.3em 0;
    .avatar {
      margin-left: 28px;
      width: 20px;
      height: 20px;
      border-radius: 5px;
    }

    .media-body {
      font-size: 1em;
      line-height: 22px;
    }
  }
}

.status-fadein {
  animation-duration: 0.5s;
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
  color: $blue;
}

.icon-reply.icon-reply-active {
  color: $blue;
}

.status .avatar-compact {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 5px;
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

.status .avatar-retweeter {
  width: 24px;
  height: 24px;
  position: absolute;
  margin-left: 24px;
  margin-top: 24px;
}

.status {
  display: flex;
  padding: 0.6em;
  border-left: 4px rgba(255, 48, 16, 0.65);
  border-left-style: inherit;
}

.status-conversation:last-child {
  border-bottom: none;
}

.timeline .panel.timeline {
  border-radius: 10px;
  overflow: hidden;
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
}

</style>
