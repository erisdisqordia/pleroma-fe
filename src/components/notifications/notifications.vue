<template>
  <div class="notifications">
    <div class="panel panel-default">
      <div class="panel-heading">
        <span class="unseen-count" v-if="unseenCount">{{unseenCount}}</span>
        <div class="title"> {{$t('notifications.notifications')}}</div>
        <div @click.prevent class="loadmore-error alert error" v-if="error">
          {{$t('timeline.error_fetching')}}
        </div>
        <button v-if="unseenCount" @click.prevent="markAsSeen" class="read-button">{{$t('notifications.read')}}</button>
      </div>
      <div class="panel-body">
        <div v-for="notification in visibleNotifications" :key="notification.action.id" class="notification" :class='{"unseen": !notification.seen}'>
          <notification :notification="notification"></notification>
        </div>
      </div>
      <div class="panel-footer">
        <a href="#" v-on:click.prevent='fetchOlderNotifications()' v-if="!notifications.loading">
          <div class="new-status-notification text-center panel-footer">{{$t('notifications.load_older')}}</div>
        </a>
        <div class="new-status-notification text-center panel-footer" v-else>...</div>
      </div>
    </div>
  </div>
</template>

<script src="./notifications.js"></script>
<style lang="scss" src="./notifications.scss"></style>
