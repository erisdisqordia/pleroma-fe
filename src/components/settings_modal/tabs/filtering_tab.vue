<template>
  <div :label="$t('settings.filtering')">
    <div class="setting-item">
      <div class="select-multiple">
        <span class="label">{{ $t('settings.notification_visibility') }}</span>
        <ul class="option-list">
          <li>
            <BooleanSetting path="notificationVisibility.likes">
              {{ $t('settings.notification_visibility_likes') }}
            </BooleanSetting>
          </li>
          <li>
            <BooleanSetting path="notificationVisibility.repeats">
              {{ $t('settings.notification_visibility_repeats') }}
            </BooleanSetting>
          </li>
          <li>
            <BooleanSetting path="notificationVisibility.follows">
              {{ $t('settings.notification_visibility_follows') }}
            </BooleanSetting>
          </li>
          <li>
            <BooleanSetting path="notificationVisibility.mentions">
              {{ $t('settings.notification_visibility_mentions') }}
            </BooleanSetting>
          </li>
          <li>
            <BooleanSetting path="notificationVisibility.moves">
              {{ $t('settings.notification_visibility_moves') }}
            </BooleanSetting>
          </li>
          <li>
            <BooleanSetting path="notificationVisibility.emojiReactions">
              {{ $t('settings.notification_visibility_emoji_reactions') }}
            </BooleanSetting>
          </li>
        </ul>
      </div>
      <div>
        {{ $t('settings.replies_in_timeline') }}
        <label
          for="replyVisibility"
          class="select"
        >
          <select
            id="replyVisibility"
            v-model="replyVisibility"
          >
            <option
              value="all"
              selected
            >{{ $t('settings.reply_visibility_all') }}</option>
            <option value="following">{{ $t('settings.reply_visibility_following') }}</option>
            <option value="self">{{ $t('settings.reply_visibility_self') }}</option>
          </select>
          <FAIcon
            class="select-down-icon"
            icon="chevron-down"
          />
        </label>
      </div>
      <div>
        <BooleanSetting path="muteBotStatuses">
          {{ $t('settings.mute_bot_posts') }}
        </BooleanSetting>
      </div>
      <div>
        <BooleanSetting path="hidePostStats">
          {{ $t('settings.hide_post_stats') }}
        </BooleanSetting>
      </div>
      <div>
        <BooleanSetting path="hideUserStats">
          {{ $t('settings.hide_user_stats') }}
        </BooleanSetting>
      </div>
    </div>
    <div class="setting-item">
      <div>
        <p>{{ $t('settings.filtering_explanation') }}</p>
        <textarea
          id="muteWords"
          v-model="muteWordsString"
          class="resize-height"
        />
      </div>
      <div>
        <BooleanSetting path="hideFilteredStatuses">
          {{ $t('settings.hide_filtered_statuses') }}
        </BooleanSetting>
      </div>
    </div>
  </div>
</template>
<script src="./filtering_tab.js"></script>
