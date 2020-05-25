<template>
  <div :label="$t('settings.filtering')">
    <div class="setting-item">
      <div class="select-multiple">
        <span class="label">{{ $t('settings.notification_visibility') }}</span>
        <ul class="option-list">
          <li>
            <Checkbox v-model="notificationVisibility.likes">
              {{ $t('settings.notification_visibility_likes') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationVisibility.repeats">
              {{ $t('settings.notification_visibility_repeats') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationVisibility.follows">
              {{ $t('settings.notification_visibility_follows') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationVisibility.mentions">
              {{ $t('settings.notification_visibility_mentions') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationVisibility.moves">
              {{ $t('settings.notification_visibility_moves') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationVisibility.emojiReactions">
              {{ $t('settings.notification_visibility_emoji_reactions') }}
            </Checkbox>
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
          <i class="icon-down-open" />
        </label>
      </div>
      <div>
        <Checkbox v-model="hidePostStats">
          {{ $t('settings.hide_post_stats') }} {{ $t('settings.instance_default', { value: hidePostStatsLocalizedValue }) }}
        </Checkbox>
      </div>
      <div>
        <Checkbox v-model="hideUserStats">
          {{ $t('settings.hide_user_stats') }} {{ $t('settings.instance_default', { value: hideUserStatsLocalizedValue }) }}
        </Checkbox>
      </div>
    </div>
    <div class="setting-item">
      <div>
        <p>{{ $t('settings.filtering_explanation') }}</p>
        <textarea
          id="muteWords"
          v-model="muteWordsString"
        />
      </div>
      <div>
        <Checkbox v-model="hideFilteredStatuses">
          {{ $t('settings.hide_filtered_statuses') }} {{ $t('settings.instance_default', { value: hideFilteredStatusesLocalizedValue }) }}
        </Checkbox>
      </div>
    </div>
  </div>
</template>
<script src="./filtering_tab.js"></script>
