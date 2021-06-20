<template>
  <div :label="$t('settings.general')">
    <div class="setting-item">
      <h2>{{ $t('settings.interface') }}</h2>
      <ul class="setting-list">
        <li>
          <interface-language-switcher />
        </li>
        <li v-if="instanceSpecificPanelPresent">
          <BooleanSetting path="hideISP">
            {{ $t('settings.hide_isp') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="sidebarRight">
            {{ $t('settings.right_sidebar') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="showThirdColumn">
            {{ $t('settings.show_third_column') }}
          </BooleanSetting>
        </li>
        <li v-if="instanceWallpaperUsed">
          <BooleanSetting path="hideInstanceWallpaper">
            {{ $t('settings.hide_wallpaper') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="hideFollowRequestCount">
            {{ $t('settings.hide_follow_request_count') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="hideShoutbox">
            {{ $t('settings.hide_shoutbox') }} {{ $t('shoutbox.title') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="showNewPostButton">
            {{ $t('settings.showPostButton') }}
          </BooleanSetting>
        </li>
      </ul>
    </div>
    <div class="setting-item">
      <h2>{{ $t('nav.timeline') }}</h2>
      <ul class="setting-list">
        <li>
          <BooleanSetting path="hideMutedPosts">
            {{ $t('settings.hide_muted_posts') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="collapseMessageWithSubject">
            {{ $t('settings.collapse_subject') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="streaming">
            {{ $t('settings.streaming') }}
          </BooleanSetting>
          <ul
            class="setting-list suboptions"
            :class="[{disabled: !streaming}]"
          >
            <li>
              <BooleanSetting
                path="pauseOnUnfocused"
                :disabled="!streaming"
              >
                {{ $t('settings.pause_on_unfocused') }}
              </BooleanSetting>
            </li>
          </ul>
        </li>
        <li>
          <BooleanSetting path="useStreamingApi">
            {{ $t('settings.useStreamingApi') }}
            <br>
            <small>
              {{ $t('settings.useStreamingApiWarning') }}
            </small>
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="emojiReactionsOnTimeline">
            {{ $t('settings.emoji_reactions_on_timeline') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="virtualScrolling">
            {{ $t('settings.virtual_scrolling') }}
          </BooleanSetting>
        </li>
      </ul>
    </div>

    <div class="setting-item">
      <h2>{{ $t('settings.composing') }}</h2>
      <ul class="setting-list">
        <li>
          <BooleanSetting path="scopeCopy">
            {{ $t('settings.scope_copy') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="alwaysShowSubjectInput">
            {{ $t('settings.subject_input_always_show') }}
          </BooleanSetting>
        </li>
        <li>
          <div>
            {{ $t('settings.subject_line_behavior') }}
            <label
              for="subjectLineBehavior"
              class="select"
            >
              <select
                id="subjectLineBehavior"
                v-model="subjectLineBehavior"
              >
                <option value="email">
                  {{ $t('settings.subject_line_email') }}
                  {{ subjectLineBehaviorDefaultValue == 'email' ? $t('settings.instance_default_simple') : '' }}
                </option>
                <option value="masto">
                  {{ $t('settings.subject_line_mastodon') }}
                  {{ subjectLineBehaviorDefaultValue == 'mastodon' ? $t('settings.instance_default_simple') : '' }}
                </option>
                <option value="noop">
                  {{ $t('settings.subject_line_noop') }}
                  {{ subjectLineBehaviorDefaultValue == 'noop' ? $t('settings.instance_default_simple') : '' }}
                </option>
              </select>
              <FAIcon
                class="select-down-icon"
                icon="chevron-down"
              />
            </label>
          </div>
        </li>
        <li v-if="postFormats.length > 0">
          <div>
            {{ $t('settings.post_status_content_type') }}
            <label
              for="postContentType"
              class="select"
            >
              <select
                id="postContentType"
                v-model="postContentType"
              >
                <option
                  v-for="postFormat in postFormats"
                  :key="postFormat"
                  :value="postFormat"
                >
                  {{ $t(`post_status.content_type["${postFormat}"]`) }}
                  {{ postContentTypeDefaultValue === postFormat ? $t('settings.instance_default_simple') : '' }}
                </option>
              </select>
              <FAIcon
                class="select-down-icon"
                icon="chevron-down"
              />
            </label>
          </div>
        </li>
        <li>
          <BooleanSetting path="minimalScopesMode">
            {{ $t('settings.minimal_scopes_mode') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="sensitiveByDefault">
            {{ $t('settings.sensitive_by_default') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="autohideFloatingPostButton">
            {{ $t('settings.autohide_floating_post_button') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="padEmoji">
            {{ $t('settings.pad_emoji') }}
          </BooleanSetting>
        </li>
      </ul>
    </div>

    <div class="setting-item">
      <h2>{{ $t('settings.attachments') }}</h2>
      <ul class="setting-list">
        <li>
          <BooleanSetting path="hideAttachments">
            {{ $t('settings.hide_attachments_in_tl') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="hideAttachmentsInConv">
            {{ $t('settings.hide_attachments_in_convo') }}
          </BooleanSetting>
        </li>
        <li>
          <label for="maxThumbnails">
            {{ $t('settings.max_thumbnails') }}
          </label>
          <input
            id="maxThumbnails"
            path.number="maxThumbnails"
            class="number-input"
            type="number"
            min="0"
            step="1"
          >
        </li>
        <li>
          <BooleanSetting path="hideNsfw">
            {{ $t('settings.nsfw_clickthrough') }}
          </BooleanSetting>
        </li>
        <ul class="setting-list suboptions">
          <li>
            <BooleanSetting
              path="preloadImage"
              :disabled="!hideNsfw"
            >
              {{ $t('settings.preload_images') }}
            </BooleanSetting>
          </li>
          <li>
            <BooleanSetting
              path="useOneClickNsfw"
              :disabled="!hideNsfw"
            >
              {{ $t('settings.use_one_click_nsfw') }}
            </BooleanSetting>
          </li>
        </ul>
        <li>
          <BooleanSetting path="stopGifs">
            {{ $t('settings.stop_gifs') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="loopVideo">
            {{ $t('settings.loop_video') }}
          </BooleanSetting>
          <ul
            class="setting-list suboptions"
            :class="[{disabled: !streaming}]"
          >
            <li>
              <BooleanSetting
                path="loopVideoSilentOnly"
                :disabled="!loopVideo || !loopSilentAvailable"
              >
                {{ $t('settings.loop_video_silent_only') }}
              </BooleanSetting>
              <div
                v-if="!loopSilentAvailable"
                class="unavailable"
              >
                <FAIcon icon="globe" />! {{ $t('settings.limited_availability') }}
              </div>
            </li>
          </ul>
        </li>
        <li>
          <BooleanSetting path="playVideosInModal">
            {{ $t('settings.play_videos_in_modal') }}
          </BooleanSetting>
        </li>
        <li>
          <BooleanSetting path="useContainFit">
            {{ $t('settings.use_contain_fit') }}
          </BooleanSetting>
        </li>
      </ul>
    </div>

    <div class="setting-item">
      <h2>{{ $t('settings.notifications') }}</h2>
      <ul class="setting-list">
        <li>
          <BooleanSetting path="webPushNotifications">
            {{ $t('settings.enable_web_push_notifications') }}
          </BooleanSetting>
        </li>
      </ul>
    </div>

    <div class="setting-item">
      <h2>{{ $t('settings.fun') }}</h2>
      <ul class="setting-list">
        <li>
          <BooleanSetting path="greentext">
            {{ $t('settings.greentext') }}
          </BooleanSetting>
        </li>
      </ul>
    </div>
  </div>
</template>

<script src="./general_tab.js"></script>
