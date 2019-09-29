<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      <div class="title">
        {{ $t('settings.settings') }}
      </div>

      <transition name="fade">
        <template v-if="currentSaveStateNotice">
          <div
            v-if="currentSaveStateNotice.error"
            class="alert error"
            @click.prevent
          >
            {{ $t('settings.saving_err') }}
          </div>

          <div
            v-if="!currentSaveStateNotice.error"
            class="alert transparent"
            @click.prevent
          >
            {{ $t('settings.saving_ok') }}
          </div>
        </template>
      </transition>
    </div>
    <div class="panel-body">
      <keep-alive>
        <tab-switcher>
          <div :label="$t('settings.general')">
            <div class="setting-item">
              <h2>{{ $t('settings.interface') }}</h2>
              <ul class="setting-list">
                <li>
                  <interface-language-switcher />
                </li>
                <li v-if="instanceSpecificPanelPresent">
                  <input
                    id="hideISP"
                    v-model="hideISP"
                    type="checkbox"
                  >
                  <label for="hideISP">{{ $t('settings.hide_isp') }}</label>
                </li>
              </ul>
            </div>
            <div class="setting-item">
              <h2>{{ $t('nav.timeline') }}</h2>
              <ul class="setting-list">
                <li>
                  <input
                    id="hideMutedPosts"
                    v-model="hideMutedPosts"
                    type="checkbox"
                  >
                  <label for="hideMutedPosts">{{ $t('settings.hide_muted_posts') }} {{ $t('settings.instance_default', { value: hideMutedPostsLocalizedValue }) }}</label>
                </li>
                <li>
                  <input
                    id="collapseMessageWithSubject"
                    v-model="collapseMessageWithSubject"
                    type="checkbox"
                  >
                  <label for="collapseMessageWithSubject">{{ $t('settings.collapse_subject') }} {{ $t('settings.instance_default', { value: collapseMessageWithSubjectLocalizedValue }) }}</label>
                </li>
                <li>
                  <input
                    id="streaming"
                    v-model="streaming"
                    type="checkbox"
                  >
                  <label for="streaming">{{ $t('settings.streaming') }}</label>
                  <ul
                    class="setting-list suboptions"
                    :class="[{disabled: !streaming}]"
                  >
                    <li>
                      <input
                        id="pauseOnUnfocused"
                        v-model="pauseOnUnfocused"
                        :disabled="!streaming"
                        type="checkbox"
                      >
                      <label for="pauseOnUnfocused">{{ $t('settings.pause_on_unfocused') }}</label>
                    </li>
                  </ul>
                </li>
                <li>
                  <input
                    id="autoload"
                    v-model="autoLoad"
                    type="checkbox"
                  >
                  <label for="autoload">{{ $t('settings.autoload') }}</label>
                </li>
                <li>
                  <input
                    id="hoverPreview"
                    v-model="hoverPreview"
                    type="checkbox"
                  >
                  <label for="hoverPreview">{{ $t('settings.reply_link_preview') }}</label>
                </li>
              </ul>
            </div>

            <div class="setting-item">
              <h2>{{ $t('settings.composing') }}</h2>
              <ul class="setting-list">
                <li>
                  <input
                    id="scopeCopy"
                    v-model="scopeCopy"
                    type="checkbox"
                  >
                  <label for="scopeCopy">
                    {{ $t('settings.scope_copy') }} {{ $t('settings.instance_default', { value: scopeCopyLocalizedValue }) }}
                  </label>
                </li>
                <li>
                  <input
                    id="subjectHide"
                    v-model="alwaysShowSubjectInput"
                    type="checkbox"
                  >
                  <label for="subjectHide">
                    {{ $t('settings.subject_input_always_show') }} {{ $t('settings.instance_default', { value: alwaysShowSubjectInputLocalizedValue }) }}
                  </label>
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
                          {{ subjectLineBehaviorLocalizedValue == 'email' ? $t('settings.instance_default_simple') : '' }}
                        </option>
                        <option value="masto">
                          {{ $t('settings.subject_line_mastodon') }}
                          {{ subjectLineBehaviorLocalizedValue == 'mastodon' ? $t('settings.instance_default_simple') : '' }}
                        </option>
                        <option value="noop">
                          {{ $t('settings.subject_line_noop') }}
                          {{ subjectLineBehaviorLocalizedValue == 'noop' ? $t('settings.instance_default_simple') : '' }}
                        </option>
                      </select>
                      <i class="icon-down-open" />
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
                          {{ postContentTypeLocalizedValue === postFormat ? $t('settings.instance_default_simple') : '' }}
                        </option>
                      </select>
                      <i class="icon-down-open" />
                    </label>
                  </div>
                </li>
                <li>
                  <input
                    id="minimalScopesMode"
                    v-model="minimalScopesMode"
                    type="checkbox"
                  >
                  <label for="minimalScopesMode">
                    {{ $t('settings.minimal_scopes_mode') }} {{ $t('settings.instance_default', { value: minimalScopesModeLocalizedValue }) }}
                  </label>
                </li>
                <li>
                  <input
                    id="autohideFloatingPostButton"
                    v-model="autohideFloatingPostButton"
                    type="checkbox"
                  >
                  <label for="autohideFloatingPostButton">{{ $t('settings.autohide_floating_post_button') }}</label>
                </li>
                <li>
                  <input
                    id="padEmoji"
                    v-model="padEmoji"
                    type="checkbox"
                  >
                  <label for="padEmoji">{{ $t('settings.pad_emoji') }}</label>
                </li>
              </ul>
            </div>

            <div class="setting-item">
              <h2>{{ $t('settings.attachments') }}</h2>
              <ul class="setting-list">
                <li>
                  <input
                    id="hideAttachments"
                    v-model="hideAttachments"
                    type="checkbox"
                  >
                  <label for="hideAttachments">{{ $t('settings.hide_attachments_in_tl') }}</label>
                </li>
                <li>
                  <input
                    id="hideAttachmentsInConv"
                    v-model="hideAttachmentsInConv"
                    type="checkbox"
                  >
                  <label for="hideAttachmentsInConv">{{ $t('settings.hide_attachments_in_convo') }}</label>
                </li>
                <li>
                  <label for="maxThumbnails">{{ $t('settings.max_thumbnails') }}</label>
                  <input
                    id="maxThumbnails"
                    v-model.number="maxThumbnails"
                    class="number-input"
                    type="number"
                    min="0"
                    step="1"
                  >
                </li>
                <li>
                  <input
                    id="hideNsfw"
                    v-model="hideNsfw"
                    type="checkbox"
                  >
                  <label for="hideNsfw">{{ $t('settings.nsfw_clickthrough') }}</label>
                </li>
                <ul class="setting-list suboptions">
                  <li>
                    <input
                      id="preloadImage"
                      v-model="preloadImage"
                      :disabled="!hideNsfw"
                      type="checkbox"
                    >
                    <label for="preloadImage">{{ $t('settings.preload_images') }}</label>
                  </li>
                  <li>
                    <input
                      id="useOneClickNsfw"
                      v-model="useOneClickNsfw"
                      :disabled="!hideNsfw"
                      type="checkbox"
                    >
                    <label for="useOneClickNsfw">{{ $t('settings.use_one_click_nsfw') }}</label>
                  </li>
                </ul>
                <li>
                  <input
                    id="stopGifs"
                    v-model="stopGifs"
                    type="checkbox"
                  >
                  <label for="stopGifs">{{ $t('settings.stop_gifs') }}</label>
                </li>
                <li>
                  <input
                    id="loopVideo"
                    v-model="loopVideo"
                    type="checkbox"
                  >
                  <label for="loopVideo">{{ $t('settings.loop_video') }}</label>
                  <ul
                    class="setting-list suboptions"
                    :class="[{disabled: !streaming}]"
                  >
                    <li>
                      <input
                        id="loopVideoSilentOnly"
                        v-model="loopVideoSilentOnly"
                        :disabled="!loopVideo || !loopSilentAvailable"
                        type="checkbox"
                      >
                      <label for="loopVideoSilentOnly">{{ $t('settings.loop_video_silent_only') }}</label>
                      <div
                        v-if="!loopSilentAvailable"
                        class="unavailable"
                      >
                        <i class="icon-globe" />! {{ $t('settings.limited_availability') }}
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <input
                    id="playVideosInModal"
                    v-model="playVideosInModal"
                    type="checkbox"
                  >
                  <label for="playVideosInModal">{{ $t('settings.play_videos_in_modal') }}</label>
                </li>
                <li>
                  <input
                    id="useContainFit"
                    v-model="useContainFit"
                    type="checkbox"
                  >
                  <label for="useContainFit">{{ $t('settings.use_contain_fit') }}</label>
                </li>
              </ul>
            </div>

            <div class="setting-item">
              <h2>{{ $t('settings.notifications') }}</h2>
              <ul class="setting-list">
                <li>
                  <input
                    id="webPushNotifications"
                    v-model="webPushNotifications"
                    type="checkbox"
                  >
                  <label for="webPushNotifications">
                    {{ $t('settings.enable_web_push_notifications') }}
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <div :label="$t('settings.theme')">
            <div class="setting-item">
              <style-switcher />
            </div>
          </div>

          <div :label="$t('settings.filtering')">
            <div class="setting-item">
              <div class="select-multiple">
                <span class="label">{{ $t('settings.notification_visibility') }}</span>
                <ul class="option-list">
                  <li>
                    <input
                      id="notification-visibility-likes"
                      v-model="notificationVisibility.likes"
                      type="checkbox"
                    >
                    <label for="notification-visibility-likes">
                      {{ $t('settings.notification_visibility_likes') }}
                    </label>
                  </li>
                  <li>
                    <input
                      id="notification-visibility-repeats"
                      v-model="notificationVisibility.repeats"
                      type="checkbox"
                    >
                    <label for="notification-visibility-repeats">
                      {{ $t('settings.notification_visibility_repeats') }}
                    </label>
                  </li>
                  <li>
                    <input
                      id="notification-visibility-follows"
                      v-model="notificationVisibility.follows"
                      type="checkbox"
                    >
                    <label for="notification-visibility-follows">
                      {{ $t('settings.notification_visibility_follows') }}
                    </label>
                  </li>
                  <li>
                    <input
                      id="notification-visibility-mentions"
                      v-model="notificationVisibility.mentions"
                      type="checkbox"
                    >
                    <label for="notification-visibility-mentions">
                      {{ $t('settings.notification_visibility_mentions') }}
                    </label>
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
                <input
                  id="hidePostStats"
                  v-model="hidePostStats"
                  type="checkbox"
                >
                <label for="hidePostStats">
                  {{ $t('settings.hide_post_stats') }} {{ $t('settings.instance_default', { value: hidePostStatsLocalizedValue }) }}
                </label>
              </div>
              <div>
                <input
                  id="hideUserStats"
                  v-model="hideUserStats"
                  type="checkbox"
                >
                <label for="hideUserStats">
                  {{ $t('settings.hide_user_stats') }} {{ $t('settings.instance_default', { value: hideUserStatsLocalizedValue }) }}
                </label>
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
                <input
                  id="hideFilteredStatuses"
                  v-model="hideFilteredStatuses"
                  type="checkbox"
                >
                <label for="hideFilteredStatuses">
                  {{ $t('settings.hide_filtered_statuses') }} {{ $t('settings.instance_default', { value: hideFilteredStatusesLocalizedValue }) }}
                </label>
              </div>
            </div>
          </div>
          <div :label="$t('settings.version.title')">
            <div class="setting-item">
              <ul class="setting-list">
                <li>
                  <p>{{ $t('settings.version.backend_version') }}</p>
                  <ul class="option-list">
                    <li>
                      <a
                        :href="backendVersionLink"
                        target="_blank"
                      >{{ backendVersion }}</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <p>{{ $t('settings.version.frontend_version') }}</p>
                  <ul class="option-list">
                    <li>
                      <a
                        :href="frontendVersionLink"
                        target="_blank"
                      >{{ frontendVersion }}</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </tab-switcher>
      </keep-alive>
    </div>
  </div>
</template>

<script src="./settings.js">
</script>
