<template>
  <status
    v-if="notification.type === 'mention'"
    :compact="true"
    :statusoid="notification.status"
  />
  <div v-else>
    <div
      v-if="needMute && !unmuted"
      class="container muted"
    >
      <small>
        <router-link :to="userProfileLink">
          {{ notification.from_profile.screen_name }}
        </router-link>
      </small>
      <a
        href="#"
        class="unmute"
        @click.prevent="toggleMute"
      ><i class="button-icon icon-eye-off" /></a>
    </div>
    <div
      v-else
      class="non-mention"
      :class="[userClass, { highlighted: userStyle }]"
      :style="[ userStyle ]"
    >
      <a
        class="avatar-container"
        :href="notification.from_profile.statusnet_profile_url"
        @click.stop.prevent.capture="toggleUserExpanded"
      >
        <UserAvatar
          :compact="true"
          :better-shadow="betterShadow"
          :user="notification.from_profile"
        />
      </a>
      <div class="notification-right">
        <UserCard
          v-if="userExpanded"
          :user-id="getUser(notification).id"
          :rounded="true"
          :bordered="true"
        />
        <span class="notification-details">
          <div class="name-and-action">
            <!-- eslint-disable vue/no-v-html -->
            <bdi
              v-if="!!notification.from_profile.name_html"
              class="username"
              :title="'@'+notification.from_profile.screen_name"
              v-html="notification.from_profile.name_html"
            />
            <!-- eslint-enable vue/no-v-html -->
            <span
              v-else
              class="username"
              :title="'@'+notification.from_profile.screen_name"
            >{{ notification.from_profile.name }}</span>
            <span v-if="notification.type === 'like'">
              <i class="fa icon-star lit" />
              <small>{{ $t('notifications.favorited_you') }}</small>
            </span>
            <span v-if="notification.type === 'repeat'">
              <i
                class="fa icon-retweet lit"
                :title="$t('tool_tip.repeat')"
              />
              <small>{{ $t('notifications.repeated_you') }}</small>
            </span>
            <span v-if="notification.type === 'follow'">
              <i class="fa icon-user-plus lit" />
              <small>{{ $t('notifications.followed_you') }}</small>
            </span>
            <span v-if="notification.type === 'follow_request'">
              <i class="fa icon-user lit" />
              <small>{{ $t('notifications.follow_request') }}</small>
            </span>
            <span v-if="notification.type === 'move'">
              <i class="fa icon-arrow-curved lit" />
              <small>{{ $t('notifications.migrated_to') }}</small>
            </span>
            <span v-if="notification.type === 'pleroma:emoji_reaction'">
              <small>
                <i18n path="notifications.reacted_with">
                  <span class="emoji-reaction-emoji">{{ notification.emoji }}</span>
                </i18n>
              </small>
            </span>
          </div>
          <div
            v-if="isStatusNotification"
            class="timeago"
          >
            <router-link
              v-if="notification.status"
              :to="{ name: 'conversation', params: { id: notification.status.id } }"
              class="faint-link"
            >
              <Timeago
                :time="notification.created_at"
                :auto-update="240"
              />
            </router-link>
          </div>
          <div
            v-else
            class="timeago"
          >
            <span class="faint">
              <Timeago
                :time="notification.created_at"
                :auto-update="240"
              />
            </span>
          </div>
          <a
            v-if="needMute"
            href="#"
            @click.prevent="toggleMute"
          ><i class="button-icon icon-eye-off" /></a>
        </span>
        <div
          v-if="notification.type === 'follow' || notification.type === 'follow_request'"
          class="follow-text"
        >
          <router-link
            :to="userProfileLink"
            class="follow-name"
          >
            @{{ notification.from_profile.screen_name }}
          </router-link>
          <div
            v-if="notification.type === 'follow_request'"
            style="white-space: nowrap;"
          >
            <i
              class="icon-ok button-icon follow-request-accept"
              :title="$t('tool_tip.accept_follow_request')"
              @click="approveUser()"
            />
            <i
              class="icon-cancel button-icon follow-request-reject"
              :title="$t('tool_tip.reject_follow_request')"
              @click="denyUser()"
            />
          </div>
        </div>
        <div
          v-else-if="notification.type === 'move'"
          class="move-text"
        >
          <router-link :to="targetUserProfileLink">
            @{{ notification.target.screen_name }}
          </router-link>
        </div>
        <template v-else>
          <status-content
            class="faint"
            :status="notification.action"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script src="./notification.js"></script>
