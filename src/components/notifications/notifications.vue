<template>
  <div
    :class="{ minimal: minimalMode }"
    class="Notifications"
  >
    <div :class="mainClass">
      <div
        v-if="!noHeading"
        class="panel-heading"
      >
        <div class="title">
          {{ $t('notifications.notifications') }}
          <span
            v-if="unseenCount"
            class="badge badge-notification unseen-count"
          >{{ unseenCount }}</span>
        </div>
        <button
          v-if="unseenCount"
          class="button-default read-button"
          @click.prevent="markAsSeen"
        >
          {{ $t('notifications.read') }}
        </button>
      </div>
      <div class="panel-body">
        <div
          v-for="notification in notificationsToDisplay"
          :key="notification.id"
          class="notification"
          :class="{&quot;unseen&quot;: !minimalMode && !notification.seen}"
        >
          <div class="notification-overlay" />
          <notification :notification="notification" />
        </div>
      </div>
      <div class="panel-footer notifications-footer">
        <div
          v-if="bottomedOut"
          class="new-status-notification text-center faint"
        >
          {{ $t('notifications.no_more_notifications') }}
        </div>
        <button
          v-else-if="!loading"
          class="button-unstyled -link -fullwidth"
          @click.prevent="fetchOlderNotifications()"
        >
          <div class="new-status-notification text-center">
            {{ minimalMode ? $t('interactions.load_older') : $t('notifications.load_older') }}
          </div>
        </button>
        <div
          v-else
          class="new-status-notification text-center"
        >
          <FAIcon
            icon="circle-notch"
            spin
            size="lg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./notifications.js"></script>
<style lang="scss" src="./notifications.scss"></style>
