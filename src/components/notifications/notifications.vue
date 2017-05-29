<template>
  <div class="notifications">
    <div class="panel panel-default base00-background">
      <div class="panel-heading base01-background base04">
        <span class="unseen-count" v-if="unseenCount">{{unseenCount}}</span>
        Notifications
        <button @click.prevent="markAsSeen" class="base06 base02-background read-button">Read!</button>
      </div>
      <div class="panel-body base03-border">
        <div v-for="notification in visibleNotifications" class="notification" :class='{"unseen": !notification.seen}'>
          <a :href="notification.action.user.statusnet_profile_url">
            <img class='avatar' :src="notification.action.user.profile_image_url_original">
          </a>
          <div class='text'>
            <div v-if="notification.type === 'favorite'">
              <h1>
                {{ notification.action.user.name }}
                <i class="fa icon-star"></i>
                <small><router-link :to="{ name: 'conversation', params: { id: notification.status.id } }"><timeago :since="notification.action.created_at" :auto-update="240"></timeago></router-link></small>
              </h1>
            <p>{{ notification.status.text }}</p>
            </div>
            <div v-if="notification.type === 'repeat'">
              <h1>
                {{ notification.action.user.name }}
                <i class="fa icon-retweet"></i>
                <small><router-link :to="{ name: 'conversation', params: { id: notification.status.id } }"><timeago :since="notification.action.created_at" :auto-update="240"></timeago></router-link></small>
              </h1>
            <p>{{ notification.status.text }}</p>
            </div>
            <div v-if="notification.type === 'mention'">
                <h1>
                  {{ notification.action.user.name }}
                  <i class="fa icon-reply"></i>
                  <small><router-link :to="{ name: 'conversation', params: { id: notification.status.id } }"><timeago :since="notification.action.created_at" :auto-update="240"></timeago></router-link></small>
                </h1>
              <p>{{ notification.status.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./notifications.js"></script>
<style lang="scss" src="./notifications.scss"></style>
