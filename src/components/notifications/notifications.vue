<template>
  <div class="notifications">
    <div class="panel panel-default">
      <div class="panel-heading">Notifications ({{visibleNotifications.length}})</div>
      <div class="panel-body">
        <div v-for="notification in visibleNotifications" class="notification">
          <a :href="notification.action.user.statusnet_profile_url">
            <img class='avatar' :src="notification.action.user.profile_image_url_original">
          </a>
          <div class='text'>
            <div v-if="notification.type === 'favorite'">
              <h1>{{ notification.action.user.name }}<i class="fa icon-star"></i> favorited your <router-link :to="{ name: 'conversation', params: { id: notification.status.id } }">status</h1>
              <p>{{ notification.status.text }}</p>
            </div>
            <div v-if="notification.type === 'repeat'">
              <h1>{{ notification.action.user.name }}<i class="fa icon-retweet"></i> repeated your <router-link :to="{ name: 'conversation', params: { id: notification.status.id } }">status</h1>
              <p>{{ notification.status.text }}</p>
            </div>
            <div v-if="notification.type === 'mention'">
              <h1>{{ notification.action.user.name }}<i class="fa icon-reply"></i> <router-link :to="{ name: 'conversation', params: { id: notification.status.id } }">mentioned</router-link> you</h1>
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
