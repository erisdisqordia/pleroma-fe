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
        <small class="username">
          <i
            v-if="muted && retweet"
            class="button-icon icon-retweet"
          />
          <router-link :to="userProfileLink">
            {{ status.user.screen_name }}
          </router-link>
        </small>
        <small
          v-if="showReasonMutedThread"
          class="mute-thread"
        >
          {{ $t('status.thread_muted') }}
        </small>
        <small
          v-if="showReasonMutedThread && muteWordHits.length > 0"
          class="mute-thread"
        >
          {{ $t('status.thread_muted_and_words') }}
        </small>
        <small
          class="mute-words"
          :title="muteWordHits.join(', ')"
        >
          {{ muteWordHits.join(', ') }}
        </small>
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
            :user-id="status.user.id"
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
                  class="reply-to-popover"
                  style="min-width: 0"
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

          <StatusContent
            :status="status"
            :no-heading="noHeading"
            :highlight="highlight"
            :focused="isFocused"
          />

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
            v-if="(mergedConfig.emojiReactionsOnTimeline || isFocused) && (!noHeading && !isPreview)"
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
              v-if="loggedIn"
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
    background-color: var(--selectedPost, $fallback--lightBg);
    color: $fallback--text;
    color: var(--selectedPostText, $fallback--text);
    --lightText: var(--selectedPostLightText, $fallback--light);
    --faint: var(--selectedPostFaintText, $fallback--faint);
    --faintLink: var(--selectedPostFaintLink, $fallback--faint);
    --postLink: var(--selectedPostPostLink, $fallback--faint);
    --postFaintLink: var(--selectedPostFaintPostLink, $fallback--faint);
    --icon: var(--selectedPostIcon, $fallback--icon);
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
        overflow: hidden;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
      }
    }

    .reply-to-and-accountname {
      display: flex;
      height: 18px;
      margin-right: 0.5em;
      max-width: 100%;
      .icon-reply {
        transform: scaleX(-1);
      }
    }

    .reply-info {
      display: flex;
    }

    .reply-to-popover {
      min-width: 0;
    }

    .reply-to {
      display: flex;
    }

    .reply-to-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 0.4em 0 0.2em;
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
  padding: .25em .6em;
  height: 1.2em;
  line-height: 1.2em;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;

  .username, .mute-thread, .mute-words {
    word-wrap: normal;
    word-break: normal;
    white-space: nowrap;
  }

  .username, .mute-words {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .username {
    flex: 0 1 auto;
    margin-right: .2em;
  }

  .mute-thread {
    flex: 0 0 auto;
  }

  .mute-words {
    flex: 1 0 5em;
    margin-left: .2em;
    &::before {
      content: ' '
    }
  }

  .unmute {
    flex: 0 0 auto;
    margin-left: auto;
    display: block;
    margin-left: auto;
  }
}

.reply-body {
  flex: 1;
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
