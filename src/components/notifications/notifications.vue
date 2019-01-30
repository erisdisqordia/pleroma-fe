<template>
  <div class="notifications">
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="title">
          {{$t('notifications.notifications')}}
          <span class="badge badge-notification unseen-count" v-if="unseenCount">{{unseenCount}}</span>
        </div>
        <div @click.prevent class="loadmore-error alert error" v-if="error">
          {{$t('timeline.error_fetching')}}
        </div>
        <button v-if="unseenCount" @click.prevent="markAsSeen" class="read-button">{{$t('notifications.read')}}</button>
      </div>
      <div class="panel-body">
        <div v-for="notification in visibleNotifications" :key="notification.action.id" class="notification" :class='{"unseen": !notification.seen}'>
          <div class="notification-overlay"></div>
          <notification :notification="notification"></notification>
        </div>
      </div>
      <div class="panel-footer">
        <div v-if="bottomedOut" class="new-status-notification text-center panel-footer faint">
          {{$t('notifications.no_more_notifications')}}
        </div>
        <a v-else-if="!loading" href="#" v-on:click.prevent="fetchOlderNotifications()">
          <div class="new-status-notification text-center panel-footer">{{$t('notifications.load_older')}}</div>
        </a>
        <div v-else class="new-status-notification text-center panel-footer">
          <i class="icon-spin3 animate-spin"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./notifications.js"></script>
<style lang="scss" src="./notifications.scss"></style>
