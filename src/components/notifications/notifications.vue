<template>
  <div class="notifications">
    <div class="panel panel-default base00-background">
      <div class="panel-heading base02-background base04">
        <span class="unseen-count" v-if="unseenCount">{{unseenCount}}</span>
        {{$t('notifications.notifications')}}
        <button v-if="unseenCount" @click.prevent="markAsSeen" class="base04 base02-background read-button">{{$t('notifications.read')}}</button>
      </div>
      <div class="panel-body base03-border">
        <div v-for="notification in visibleNotifications" :key="notification" class="notification" :class='{"unseen": !notification.seen}'>
          <status v-if="notification.type === 'mention'" :compact="true" :statusoid="notification.status"></status>
          <div class="non-mention" v-else>
            <a :href="notification.action.user.statusnet_profile_url" @click.stop.prevent.capture="toggleUserExpanded">
              <StillImage class='avatar-compact' :src="notification.action.user.profile_image_url_original"/>
            </a>
            <div class='notification-right'>
              <div class="base03-border usercard" v-if="userExpanded">
                <user-card-content :user="notification.action.user" :switcher="false"></user-card-content>
              </div>
              <span class="notification-details">
                <span class="username" :title="'@'+notification.action.user.screen_name">{{ notification.action.user.name }}</span>
                <span v-if="notification.type === 'favorite'">
                  <i class="fa icon-star lit"></i>
                  <small>{{$t('notifications.favorited_you')}}</small>
                </span>
                <span v-if="notification.type === 'repeat'">
                  <i class="fa icon-retweet lit"></i>
                  <small>{{$t('notifications.repeated_you')}}</small>
                </span>
                <span v-if="notification.type === 'follow'">
                  <i class="fa icon-user-plus lit"></i>
                  <small>{{$t('notifications.followed_you')}}</small>
                </span>
                <small class="timeago"><router-link :to="{ name: 'conversation', params: { id: notification.status.id } }"><timeago :since="notification.action.created_at" :auto-update="240"></timeago></router-link></small>
              </span>
              <status class="base04" :compact="true" :statusoid="notification.status" :noHeading="true"></status>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./notifications.js"></script>
<style lang="scss" src="./notifications.scss"></style>
