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
          <span
            class="user-name"
            :title="retweeter"
          >
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
                  :title="status.user.name"
                  v-html="status.user.name_html"
                />
                <h4
                  v-else
                  class="user-name"
                  :title="status.user.name"
                >
                  {{ status.user.name }}
                </h4>
                <router-link
                  class="account-name"
                  :title="status.user.screen_name"
                  :to="userProfileLink"
                >
                  {{ status.user.screen_name }}
                </router-link>
                <img
                  class="status-favicon"
                  v-if="!!(status.user && status.user.favicon)"
                  :src="status.user.favicon"
                >
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
                  :status-id="status.parent_visible && status.in_reply_to_status_id"
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
                    <span
                      class="faint-link reply-to-text"
                      :class="{ 'strikethrough': !status.parent_visible }"
                    >
                      {{ $t('status.reply_to') }}
                    </span>
                  </a>
                </StatusPopover>
                <span
                  v-else
                  class="reply-to"
                >
                  <span class="reply-to-text">{{ $t('status.reply_to') }}</span>
                </span>
                <router-link
                  :title="replyToName"
                  :to="replyProfileLink"
                >
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
                <UserListPopover
                  v-if="statusFromGlobalRepository.rebloggedBy && statusFromGlobalRepository.rebloggedBy.length > 0"
                  :users="statusFromGlobalRepository.rebloggedBy"
                >
                  <div class="stat-count">
                    <a class="stat-title">{{ $t('status.repeats') }}</a>
                    <div class="stat-number">
                      {{ statusFromGlobalRepository.rebloggedBy.length }}
                    </div>
                  </div>
                </UserListPopover>
                <UserListPopover
                  v-if="statusFromGlobalRepository.favoritedBy && statusFromGlobalRepository.favoritedBy.length > 0"
                  :users="statusFromGlobalRepository.favoritedBy"
                >
                  <div
                    class="stat-count"
                  >
                    <a class="stat-title">{{ $t('status.favorites') }}</a>
                    <div class="stat-number">
                      {{ statusFromGlobalRepository.favoritedBy.length }}
                    </div>
                  </div>
                </UserListPopover>
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
<style src="./status.css" lang="scss"></style>
