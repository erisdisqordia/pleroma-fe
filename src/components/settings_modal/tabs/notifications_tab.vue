<template>
<div :label="$t('settings.notifications')">
  <div class="setting-item">
    <div class="select-multiple">
      <span class="label">{{ $t('settings.notification_setting') }}</span>
      <ul class="option-list">
        <li>
          <Checkbox v-model="notificationSettings.follows">
            {{ $t('settings.notification_setting_follows') }}
          </Checkbox>
        </li>
        <li>
          <Checkbox v-model="notificationSettings.followers">
            {{ $t('settings.notification_setting_followers') }}
          </Checkbox>
        </li>
        <li>
          <Checkbox v-model="notificationSettings.non_follows">
            {{ $t('settings.notification_setting_non_follows') }}
          </Checkbox>
        </li>
        <li>
          <Checkbox v-model="notificationSettings.non_followers">
            {{ $t('settings.notification_setting_non_followers') }}
          </Checkbox>
        </li>
      </ul>
    </div>
    <p>{{ $t('settings.notification_mutes') }}</p>
    <p>{{ $t('settings.notification_blocks') }}</p>
    <button
      class="btn btn-default"
      @click="updateNotificationSettings"
      >
      {{ $t('general.submit') }}
    </button>
  </div>
</div>
</template>

<script src="./notifications_tab.js"></script>
<!-- <style lang="scss" src="./profile.scss"></style> -->
