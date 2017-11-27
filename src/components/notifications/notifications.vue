<template>
  <div class="notifications">
    <div class="panel panel-default base00-background">
      <div class="panel-heading base02-background base04">
        <span class="unseen-count" v-if="unseenCount">{{unseenCount}}</span>
        {{$t('notifications.notifications')}}
        <button @click.prevent="markAsSeen" class="base04 base02-background read-button">{{$t('notifications.read')}}</button>
      </div>
      <div class="panel-body base03-border">
        <div v-for="notification in visibleNotifications" :key="notification" class="notification" :class='{"unseen": !notification.seen}'>
          <div>
            <a :href="notification.action.user.statusnet_profile_url" target="_blank">
              <img class='avatar' :src="notification.action.user.profile_image_url_original">
            </a>
          </div>
          <div class='text' style="width: 100%;">
            <div v-if="notification.type === 'favorite'">
              <h1>
                <span :title="'@'+notification.action.user.screen_name">{{ notification.action.user.name }}</span>
                <i class="fa icon-star lit"></i>
                <small><router-link :to="{ name: 'conversation', params: { id: notification.status.id } }"><timeago :since="notification.action.created_at" :auto-update="240"></timeago></router-link></small>
              </h1>
              <div class="notification-gradient" :style="hiderStyle"></div>
              <div class="notification-content" v-html="notification.status.statusnet_html"></div>
            </div>
            <div v-if="notification.type === 'repeat'">
              <h1>
                <span :title="'@'+notification.action.user.screen_name">{{ notification.action.user.name }}</span>
                <i class="fa icon-retweet lit"></i>
                <small><router-link :to="{ name: 'conversation', params: { id: notification.status.id } }"><timeago :since="notification.action.created_at" :auto-update="240"></timeago></router-link></small>
              </h1>
              <div class="notification-gradient" :style="hiderStyle"></div>
              <div class="notification-content" v-html="notification.status.statusnet_html"></div>
            </div>
            <div v-if="notification.type === 'mention'">
              <h1>
                <span :title="'@'+notification.action.user.screen_name">{{ notification.action.user.name }}</span>
                <i class="fa icon-reply lit"></i>
                <small><router-link :to="{ name: 'conversation', params: { id: notification.status.id } }"><timeago :since="notification.action.created_at" :auto-update="240"></timeago></router-link></small>
              </h1>
              <status :compact="true" :statusoid="notification.status"></status>
            </div>
            <div v-if="notification.type === 'follow'">
              <h1>
                <span :title="'@'+notification.action.user.screen_name">{{ notification.action.user.name }}</span>
                <i class="fa icon-user-plus lit"></i>
              </h1>
              <div>
                <router-link :to="{ name: 'user-profile', params: { id: notification.action.user.id } }">@{{ notification.action.user.screen_name }}</router-link> {{$t('notifications.followed_you')}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./notifications.js"></script>
<style lang="scss" src="./notifications.scss"></style>
