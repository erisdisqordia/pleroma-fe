<template>
  <div :label="$t('settings.notifications')">
    <div class="setting-item">
      <h2>{{ $t('settings.notification_setting_filters') }}</h2>
      <div class="select-multiple">
        <span class="label">{{ $t('settings.notification_setting') }}</span>
        <ul class="option-list">
          <li>
            <Checkbox v-model="notificationSettings.from_following">
              {{ $t('settings.notification_setting_from_following') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationSettings.from_followers">
              {{ $t('settings.notification_setting_from_followers') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationSettings.from_strangers">
              {{ $t('settings.notification_setting_from_strangers') }}
            </Checkbox>
          </li>
        </ul>
      </div>
    </div>

    <div class="setting-item">
      <h2>{{ $t('settings.notification_setting_privacy') }}</h2>
      <p>
        <Checkbox v-model="notificationSettings.privacy_option">
          {{ $t('settings.notification_setting_privacy_option') }}
        </Checkbox>
      </p>
    </div>
    <div class="setting-item">
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
