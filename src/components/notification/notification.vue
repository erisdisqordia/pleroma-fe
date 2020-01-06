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
          :user="getUser(notification)"
          :rounded="true"
          :bordered="true"
        />
        <span class="notification-details">
          <div class="name-and-action">
            <!-- eslint-disable vue/no-v-html -->
            <span
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
            <span v-if="notification.type === 'move'">
              <i class="fa icon-arrow-curved lit" />
              <small>{{ $t('notifications.migrated_to') }}</small>
            </span>
          </div>
          <div
            v-if="notification.type === 'follow' || notification.type === 'move'"
            class="timeago"
          >
            <span class="faint">
              <Timeago
                :time="notification.created_at"
                :auto-update="240"
              />
            </span>
          </div>
          <div
            v-else
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
          <a
            v-if="needMute"
            href="#"
            @click.prevent="toggleMute"
          ><i class="button-icon icon-eye-off" /></a>
        </span>
        <div
          v-if="notification.type === 'follow'"
          class="follow-text"
        >
          <router-link :to="userProfileLink">
            @{{ notification.from_profile.screen_name }}
          </router-link>
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
          <status
            class="faint"
            :compact="true"
            :statusoid="notification.action"
            :no-heading="true"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script src="./notification.js"></script>
