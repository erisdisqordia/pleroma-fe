<template>
  <div
    :class="{ minimal: minimalMode }"
    class="notifications"
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
        <div
          v-if="error"
          class="loadmore-error alert error"
          @click.prevent
        >
          {{ $t('timeline.error_fetching') }}
        </div>
        <button
          v-if="unseenCount"
          class="read-button"
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
      <div class="panel-footer">
        <div
          v-if="bottomedOut"
          class="new-status-notification text-center panel-footer faint"
        >
          {{ $t('notifications.no_more_notifications') }}
        </div>
        <a
          v-else-if="!loading"
          href="#"
          @click.prevent="fetchOlderNotifications()"
        >
          <div class="new-status-notification text-center panel-footer">
            {{ minimalMode ? $t('interactions.load_older') : $t('notifications.load_older') }}
          </div>
        </a>
        <div
          v-else
          class="new-status-notification text-center panel-footer"
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
