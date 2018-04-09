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
          <notification :notification="notification"></notification>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./notifications.js"></script>
<style lang="scss" src="./notifications.scss"></style>
