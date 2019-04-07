<template>
  <status
    v-if="notification.type === 'mention'"
    :compact="true"
    :statusoid="notification.status"
  />
  <div
    v-else
    class="non-mention"
    :class="[userClass, { highlighted: userStyle }]"
    :style="[ userStyle ]"
  >
    <a
      class="avatar-container"
      :href="notification.action.user.statusnet_profile_url"
      @click.stop.prevent.capture="toggleUserExpanded"
    >
      <UserAvatar
        :compact="true"
        :better-shadow="betterShadow"
        :src="notification.action.user.profile_image_url_original"
      />
    </a>
    <div class="notification-right">
      <UserCard
        v-if="userExpanded"
        :user="user"
        :rounded="true"
        :bordered="true"
      />
      <span class="notification-details">
        <div class="name-and-action">
          <span
            v-if="!!notification.action.user.name_html"
            class="username"
            :title="'@'+notification.action.user.screen_name"
            v-html="notification.action.user.name_html"
          />
          <span
            v-else
            class="username"
            :title="'@'+notification.action.user.screen_name"
          >{{ notification.action.user.name }}</span>
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
        </div>
        <div class="timeago">
          <router-link
            v-if="notification.status"
            :to="{ name: 'conversation', params: { id: notification.status.id } }"
            class="faint-link"
          >
            <timeago
              :since="notification.action.created_at"
              :auto-update="240"
            />
          </router-link>
        </div>
      </span>
      <div
        v-if="notification.type === 'follow'"
        class="follow-text"
      >
        <router-link :to="userProfileLink(notification.action.user)">
          @{{ notification.action.user.screen_name }}
        </router-link>
      </div>
      <template v-else>
        <status
          class="faint"
          :compact="true"
          :statusoid="notification.status"
          :no-heading="true"
        />
      </template>
    </div>
  </div>
</template>

<script src="./notification.js"></script>
