<template>
  <div class="notifications">
    <div class="panel panel-default base00-background">
      <div class="panel-heading base01-background base04">Notifications ({{unseenCount}}) <button @click.prevent="markAsSeen">Read!</button></div>
      <div class="panel-body">
        <div v-for="notification in visibleNotifications" class="notification" :class='{"base01-background": notification.seen}'>
          <a :href="notification.action.user.statusnet_profile_url">
            <img class='avatar' :src="notification.action.user.profile_image_url_original">
          </a>
          <div class='text'>
            <timeago :since="notification.action.created_at" :auto-update="240"></timeago>
            <div v-if="notification.type === 'favorite'">
              <h1>{{ notification.action.user.name }}<br><i class="fa icon-star"></i> favorited your <router-link :to="{ name: 'conversation', params: { id: notification.status.id } }">status</h1>
              <p>{{ notification.status.text }}</p>
            </div>
            <div v-if="notification.type === 'repeat'">
              <h1>{{ notification.action.user.name }}<br><i class="fa icon-retweet"></i> repeated your <router-link :to="{ name: 'conversation', params: { id: notification.status.id } }">status</h1>
              <p>{{ notification.status.text }}</p>
            </div>
            <div v-if="notification.type === 'mention'">
              <h1>{{ notification.action.user.name }}<br><i class="fa icon-reply"></i> <router-link :to="{ name: 'conversation', params: { id: notification.status.id } }">mentioned</router-link> you</h1>
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
