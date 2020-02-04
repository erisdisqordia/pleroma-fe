<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="!hideStatus"
    class="status-el"
    :class="[{ 'status-el_focused': isFocused }, { 'status-conversation': inlineExpanded }]"
  >
    <div
      v-if="error"
      class="alert error"
    >
      {{ error }}
      <i
        class="button-icon icon-cancel"
        @click="clearError"
      />
    </div>
    <template v-if="muted && !isPreview">
      <div class="media status container muted">
        <small>
          <router-link :to="userProfileLink">
            {{ status.user.screen_name }}
          </router-link>
        </small>
        <small class="muteWords">{{ muteWordHits.join(', ') }}</small>
        <a
          href="#"
          class="unmute"
          @click.prevent="toggleMute"
        ><i class="button-icon icon-eye-off" /></a>
      </div>
    </template>
    <template v-else>
      <div
        v-if="showPinned"
        class="status-pin"
      >
        <i class="fa icon-pin faint" />
        <span class="faint">{{ $t('status.pinned') }}</span>
      </div>
      <div
        v-if="retweet && !noHeading && !inConversation"
        :class="[repeaterClass, { highlighted: repeaterStyle }]"
        :style="[repeaterStyle]"
        class="media container retweet-info"
      >
        <UserAvatar
          v-if="retweet"
          class="media-left"
          :better-shadow="betterShadow"
          :user="statusoid.user"
        />
        <div class="media-body faint">
          <span class="user-name">
            <router-link
              v-if="retweeterHtml"
              :to="retweeterProfileLink"
              v-html="retweeterHtml"
            />
            <router-link
              v-else
              :to="retweeterProfileLink"
            >{{ retweeter }}</router-link>
          </span>
          <i
            class="fa icon-retweet retweeted"
            :title="$t('tool_tip.repeat')"
          />
          {{ $t('timeline.repeated') }}
        </div>
      </div>

      <div
        :class="[userClass, { highlighted: userStyle, 'is-retweet': retweet && !inConversation }]"
        :style="[ userStyle ]"
        class="media status"
        :data-tags="tags"
      >
        <div
          v-if="!noHeading"
          class="media-left"
        >
          <router-link
            :to="userProfileLink"
            @click.stop.prevent.capture.native="toggleUserExpanded"
          >
            <UserAvatar
              :compact="compact"
              :better-shadow="betterShadow"
              :user="status.user"
            />
          </router-link>
        </div>
        <div class="status-body">
          <UserCard
            v-if="userExpanded"
            :user="status.user"
            :rounded="true"
            :bordered="true"
            class="status-usercard"
          />
          <div
            v-if="!noHeading"
            class="media-heading"
          >
            <div class="heading-name-row">
              <div class="name-and-account-name">
                <h4
                  v-if="status.user.name_html"
                  class="user-name"
                  v-html="status.user.name_html"
                />
                <h4
                  v-else
                  class="user-name"
                >
                  {{ status.user.name }}
                </h4>
                <router-link
                  class="account-name"
                  :to="userProfileLink"
                >
                  {{ status.user.screen_name }}
                </router-link>
              </div>

              <span class="heading-right">
                <router-link
                  class="timeago faint-link"
                  :to="{ name: 'conversation', params: { id: status.id } }"
                >
                  <Timeago
                    :time="status.created_at"
                    :auto-update="60"
                  />
                </router-link>
                <div
                  v-if="status.visibility"
                  class="button-icon visibility-icon"
                >
                  <i
                    :class="visibilityIcon(status.visibility)"
                    :title="status.visibility | capitalize"
                  />
                </div>
                <a
                  v-if="!status.is_local && !isPreview"
                  :href="status.external_url"
                  target="_blank"
                  class="source_url"
                  title="Source"
                >
                  <i class="button-icon icon-link-ext-alt" />
                </a>
                <template v-if="expandable && !isPreview">
                  <a
                    href="#"
                    title="Expand"
                    @click.prevent="toggleExpanded"
                  >
                    <i class="button-icon icon-plus-squared" />
                  </a>
                </template>
                <a
                  v-if="unmuted"
                  href="#"
                  @click.prevent="toggleMute"
                ><i class="button-icon icon-eye-off" /></a>
              </span>
            </div>

            <div class="heading-reply-row">
              <div
                v-if="isReply"
                class="reply-to-and-accountname"
              >
                <StatusPopover
                  v-if="!isPreview"
                  :status-id="status.in_reply_to_status_id"
                >
                  <a
                    class="reply-to"
                    href="#"
                    :aria-label="$t('tool_tip.reply')"
                    @click.prevent="gotoOriginal(status.in_reply_to_status_id)"
                  >
                    <i class="button-icon icon-reply" />
                    <span class="faint-link reply-to-text">{{ $t('status.reply_to') }}</span>
                  </a>
                </StatusPopover>
                <span
                  v-else
                  class="reply-to"
                >
                  <span class="reply-to-text">{{ $t('status.reply_to') }}</span>
                </span>
                <router-link :to="replyProfileLink">
                  {{ replyToName }}
                </router-link>
                <span
                  v-if="replies && replies.length"
                  class="faint replies-separator"
                >
                  -
                </span>
              </div>
              <div
                v-if="inConversation && !isPreview && replies && replies.length"
                class="replies"
              >
                <span class="faint">{{ $t('status.replies_list') }}</span>
                <StatusPopover
                  v-for="reply in replies"
                  :key="reply.id"
                  :status-id="reply.id"
                >
                  <a
                    href="#"
                    class="reply-link"
                    @click.prevent="gotoOriginal(reply.id)"
                  >{{ reply.name }}</a>
                </StatusPopover>
              </div>
            </div>
          </div>

          <div
            v-if="longSubject"
            class="status-content-wrapper"
            :class="{ 'tall-status': !showingLongSubject }"
          >
            <a
              v-if="!showingLongSubject"
              class="tall-status-hider"
              :class="{ 'tall-status-hider_focused': isFocused }"
              href="#"
              @click.prevent="showingLongSubject=true"
            >{{ $t("general.show_more") }}</a>
            <div
              class="status-content media-body"
              @click.prevent="linkClicked"
              v-html="contentHtml"
            />
            <a
              v-if="showingLongSubject"
              href="#"
              class="status-unhider"
              @click.prevent="showingLongSubject=false"
            >{{ $t("general.show_less") }}</a>
          </div>
          <div
            v-else
            :class="{'tall-status': hideTallStatus}"
            class="status-content-wrapper"
          >
            <a
              v-if="hideTallStatus"
              class="tall-status-hider"
              :class="{ 'tall-status-hider_focused': isFocused }"
              href="#"
              @click.prevent="toggleShowMore"
            >{{ $t("general.show_more") }}</a>
            <div
              v-if="!hideSubjectStatus"
              class="status-content media-body"
              @click.prevent="linkClicked"
              v-html="contentHtml"
            />
            <div
              v-else
              class="status-content media-body"
              @click.prevent="linkClicked"
              v-html="status.summary_html"
            />
            <a
              v-if="hideSubjectStatus"
              href="#"
              class="cw-status-hider"
              @click.prevent="toggleShowMore"
            >{{ $t("general.show_more") }}</a>
            <a
              v-if="showingMore"
              href="#"
              class="status-unhider"
              @click.prevent="toggleShowMore"
            >{{ $t("general.show_less") }}</a>
          </div>

          <div v-if="status.poll && status.poll.options">
            <poll :base-poll="status.poll" />
          </div>

          <div
            v-if="status.attachments && (!hideSubjectStatus || showingLongSubject)"
            class="attachments media-body"
          >
            <attachment
              v-for="attachment in nonGalleryAttachments"
              :key="attachment.id"
              class="non-gallery"
              :size="attachmentSize"
              :nsfw="nsfwClickthrough"
              :attachment="attachment"
              :allow-play="true"
              :set-media="setMedia()"
            />
            <gallery
              v-if="galleryAttachments.length > 0"
              :nsfw="nsfwClickthrough"
              :attachments="galleryAttachments"
              :set-media="setMedia()"
            />
          </div>

          <div
            v-if="status.card && !hideSubjectStatus && !noHeading"
            class="link-preview media-body"
          >
            <link-preview
              :card="status.card"
              :size="attachmentSize"
              :nsfw="nsfwClickthrough"
            />
          </div>

          <transition name="fade">
            <div
              v-if="!hidePostStats && isFocused && combinedFavsAndRepeatsUsers.length > 0"
              class="favs-repeated-users"
            >
              <div class="stats">
                <div
                  v-if="statusFromGlobalRepository.rebloggedBy && statusFromGlobalRepository.rebloggedBy.length > 0"
                  class="stat-count"
                >
                  <a class="stat-title">{{ $t('status.repeats') }}</a>
                  <div class="stat-number">
                    {{ statusFromGlobalRepository.rebloggedBy.length }}
                  </div>
                </div>
                <div
                  v-if="statusFromGlobalRepository.favoritedBy && statusFromGlobalRepository.favoritedBy.length > 0"
                  class="stat-count"
                >
                  <a class="stat-title">{{ $t('status.favorites') }}</a>
                  <div class="stat-number">
                    {{ statusFromGlobalRepository.favoritedBy.length }}
                  </div>
                </div>
                <div class="avatar-row">
                  <AvatarList :users="combinedFavsAndRepeatsUsers" />
                </div>
              </div>
            </div>
          </transition>

          <EmojiReactions
            :status="status"
          />

          <div
            v-if="!noHeading && !isPreview"
            class="status-actions media-body"
          >
            <div>
              <i
                v-if="loggedIn"
                class="button-icon icon-reply"
                :title="$t('tool_tip.reply')"
                :class="{'button-icon-active': replying}"
                @click.prevent="toggleReplying"
              />
              <i
                v-else
                class="button-icon button-icon-disabled icon-reply"
                :title="$t('tool_tip.reply')"
              />
              <span v-if="status.replies_count > 0">{{ status.replies_count }}</span>
            </div>
            <retweet-button
              :visibility="status.visibility"
              :logged-in="loggedIn"
              :status="status"
            />
            <favorite-button
              :logged-in="loggedIn"
              :status="status"
            />
            <ReactButton
              :logged-in="loggedIn"
              :status="status"
            />
            <extra-buttons
              :status="status"
              @onError="showError"
              @onSuccess="clearError"
            />
          </div>
        </div>
      </div>
      <div
        v-if="replying"
        class="container"
      >
        <PostStatusForm
          class="reply-body"
          :reply-to="status.id"
          :attentions="status.attentions"
          :replied-user="status.user"
          :copy-message-scope="status.visibility"
          :subject="replySubject"
          @posted="toggleReplying"
        />
      </div>
    </template>
  </div>
<!-- eslint-enable vue/no-v-html -->
</template>

<script src="./status.js" ></script>
<style lang="scss">
@import '../../_variables.scss';

$status-margin: 0.75em;

.status-body {
  flex: 1;
  min-width: 0;
}

.status-pin {
  padding: $status-margin $status-margin 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.media-left {
  margin-right: $status-margin;
}

.status-el {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  border-left-width: 0px;
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
  }

  .status-usercard {
    margin-bottom: $status-margin;
  }

  .user-name {
    white-space: nowrap;
    font-size: 14px;
    overflow: hidden;
    flex-shrink: 0;
    max-width: 85%;
    font-weight: bold;

    img {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      object-fit: contain
    }
  }

  .media-heading {
    padding: 0;
    vertical-align: bottom;
    flex-basis: 100%;
    margin-bottom: 0.5em;

    small {
      font-weight: lighter;
    }

    .heading-name-row {
      padding: 0;
      display: flex;
      justify-content: space-between;
      line-height: 18px;

      a {
        display: inline-block;
        word-break: break-all;
      }

      .name-and-account-name {
        display: flex;
        min-width: 0;
      }

      .user-name {
        flex-shrink: 1;
        margin-right: 0.4em;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .account-name {
        min-width: 1.6em;
        margin-right: 0.4em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1 1 0;
      }
    }

    .heading-right {
      display: flex;
      flex-shrink: 0;
    }

    .timeago {
      margin-right: 0.2em;
    }

    .heading-reply-row {
      position: relative;
      align-content: baseline;
      font-size: 12px;
      line-height: 18px;
      max-width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;

      > .reply-to-and-accountname > a {
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
        word-break: break-all;
      }
    }

    .reply-to-and-accountname {
      display: flex;
      height: 18px;
      margin-right: 0.5em;
      overflow: hidden;
      max-width: 100%;
      .icon-reply {
        transform: scaleX(-1);
      }
    }

    .reply-info {
      display: flex;
    }

    .reply-to {
      display: flex;
    }

    .reply-to-text {
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0 0.4em 0 0.2em;
      color: $fallback--faint;
      color: var(--faint, $fallback--faint);
    }

    .replies-separator {
      margin-left: 0.4em;
    }

    .replies {
      line-height: 18px;
      font-size: 12px;
      display: flex;
      flex-wrap: wrap;
      & > * {
        margin-right: 0.4em;
      }
    }

    .reply-link {
      height: 17px;
    }
  }

  .tall-status {
    position: relative;
    height: 220px;
    overflow-x: hidden;
    overflow-y: hidden;
    z-index: 1;
    .status-content {
      height: 100%;
      mask: linear-gradient(to top, white, transparent) bottom/100% 70px no-repeat,
            linear-gradient(to top, white, white);
      /* Autoprefixed seem to ignore this one, and also syntax is different */
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
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
    z-index: 2;
  }

  .status-unhider, .cw-status-hider {
    width: 100%;
    text-align: center;
    display: inline-block;
    word-break: break-all;
  }

  .status-content {
    font-family: var(--postFont, sans-serif);
    line-height: 1.4em;
    white-space: pre-wrap;

    img, video {
      max-width: 100%;
      max-height: 400px;
      vertical-align: middle;
      object-fit: contain;

      &.emoji {
        width: 32px;
        height: 32px;
      }
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
      margin: 0 0 1em 0;
    }

    p:last-child {
      margin: 0 0 0 0;
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
    padding: 0.4em $status-margin;
    margin: 0;

    .avatar.still-image {
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
        overflow: hidden;
        text-overflow: ellipsis;

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
  color: $fallback--cGreen;
  color: var(--cGreen, $fallback--cGreen);
}

.status-conversation {
  border-left-style: solid;
}

.status-actions {
  position: relative;
  width: 100%;
  display: flex;
  margin-top: $status-margin;

  > * {
    max-width: 4em;
    flex: 1;
  }
}

.button-icon.icon-reply {
  &:not(.button-icon-disabled):hover,
  &.button-icon-active {
    color: $fallback--cBlue;
    color: var(--cBlue, $fallback--cBlue);
  }
}

.button-icon.icon-reply {
  &:not(.button-icon-disabled) {
    cursor: pointer;
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
  padding: $status-margin;
  &.is-retweet {
    padding-top: 0;
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

.reply-body {
  flex: 1;
}

.timeline :not(.panel-disabled) > {
  .status-el:last-child {
    border-radius: 0 0 $fallback--panelRadius $fallback--panelRadius;
    border-radius: 0 0 var(--panelRadius, $fallback--panelRadius) var(--panelRadius, $fallback--panelRadius);
    border-bottom: none;
  }
}

.favs-repeated-users {
  margin-top: $status-margin;

  .stats {
    width: 100%;
    display: flex;
    line-height: 1em;

    .stat-count {
      margin-right: $status-margin;

      .stat-title {
        color: var(--faint, $fallback--faint);
        font-size: 12px;
        text-transform: uppercase;
        position: relative;
      }

      .stat-number {
        font-weight: bolder;
        font-size: 16px;
        line-height: 1em;
      }
    }

    .avatar-row {
      flex: 1;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        position: absolute;
        height: 100%;
        width: 1px;
        left: 0;
        background-color: var(--faint, $fallback--faint);
      }
    }
  }
}

@media all and (max-width: 800px) {
  .status-el {
    .retweet-info {
      .avatar.still-image {
        margin-left: 20px;
      }
    }
  }
  .status {
    max-width: 100%;
  }

  .status .avatar.still-image {
    width: 40px;
    height: 40px;

    &.avatar-compact {
      width: 32px;
      height: 32px;
    }
  }
}

</style>
