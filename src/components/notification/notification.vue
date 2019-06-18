<template>
  <status
    v-if="notification.type === 'mention'"
    :compact="true"
    :statusoid="notification.status"
  >
  </status>
  <div class="non-mention" :class="[userClass, { highlighted: userStyle }]" :style="[ userStyle ]" v-else>
    <a class='avatar-container' :href="notification.from_profile.statusnet_profile_url" @click.stop.prevent.capture="toggleUserExpanded">
      <UserAvatar :compact="true" :betterShadow="betterShadow" :user="notification.from_profile"/>
    </a>
    <div class='notification-right'>
      <UserCard :user="getUser(notification)" :rounded="true" :bordered="true" v-if="userExpanded" />
      <span class="notification-details">
        <div class="name-and-action">
          <span class="username" v-if="!!notification.from_profile.name_html" :title="'@'+notification.from_profile.screen_name" v-html="notification.from_profile.name_html"></span>
          <span class="username" v-else :title="'@'+notification.from_profile.screen_name">{{ notification.from_profile.name }}</span>
          <span v-if="notification.type === 'like'">
            <i class="fa icon-star lit"></i>
            <small>{{$t('notifications.favorited_you')}}</small>
          </span>
          <span v-if="notification.type === 'repeat'">
            <i class="fa icon-retweet lit" :title="$t('tool_tip.repeat')"></i>
            <small>{{$t('notifications.repeated_you')}}</small>
          </span>
          <span v-if="notification.type === 'follow'">
            <i class="fa icon-user-plus lit"></i>
            <small>{{$t('notifications.followed_you')}}</small>
          </span>
        </div>
        <div class="timeago" v-if="notification.type === 'follow'">
          <span class="faint">
            <Timeago :time="notification.created_at" :auto-update="240"></Timeago>
          </span>
        </div>
        <div class="timeago" v-else>
          <router-link v-if="notification.status" :to="{ name: 'conversation', params: { id: notification.status.id } }" class="faint-link">
            <Timeago :time="notification.created_at" :auto-update="240"></Timeago>
          </router-link>
        </div>
      </span>
      <div class="follow-text" v-if="notification.type === 'follow'">
        <router-link :to="userProfileLink(notification.from_profile)">
          @{{notification.from_profile.screen_name}}
        </router-link>
      </div>
      <template v-else>
        <status class="faint" :compact="true" :statusoid="notification.action" :noHeading="true"></status>
      </template>
    </div>
  </div>
</template>

<script src="./notification.js"></script>
