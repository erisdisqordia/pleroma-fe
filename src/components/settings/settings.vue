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
                  <Checkbox v-model="hideISP">
                    {{ $t('settings.hide_isp') }}
                  </Checkbox>
                </li>
              </ul>
            </div>
            <div class="setting-item">
              <h2>{{ $t('nav.timeline') }}</h2>
              <ul class="setting-list">
                <li>
                  <Checkbox v-model="hideMutedPosts">
                    {{ $t('settings.hide_muted_posts') }} {{ $t('settings.instance_default', { value: hideMutedPostsLocalizedValue }) }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="collapseMessageWithSubject">
                    {{ $t('settings.collapse_subject') }} {{ $t('settings.instance_default', { value: collapseMessageWithSubjectLocalizedValue }) }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="streaming">
                    {{ $t('settings.streaming') }}
                  </Checkbox>
                  <ul
                    class="setting-list suboptions"
                    :class="[{disabled: !streaming}]"
                  >
                    <li>
                      <Checkbox
                        v-model="pauseOnUnfocused"
                        :disabled="!streaming"
                      >
                        {{ $t('settings.pause_on_unfocused') }}
                      </Checkbox>
                    </li>
                  </ul>
                </li>
                <li>
                  <Checkbox v-model="autoLoad">
                    {{ $t('settings.autoload') }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="hoverPreview">
                    {{ $t('settings.reply_link_preview') }}
                  </Checkbox>
                </li>
              </ul>
            </div>

            <div class="setting-item">
              <h2>{{ $t('settings.composing') }}</h2>
              <ul class="setting-list">
                <li>
                  <Checkbox v-model="scopeCopy">
                    {{ $t('settings.scope_copy') }} {{ $t('settings.instance_default', { value: scopeCopyLocalizedValue }) }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="alwaysShowSubjectInput">
                    {{ $t('settings.subject_input_always_show') }} {{ $t('settings.instance_default', { value: alwaysShowSubjectInputLocalizedValue }) }}
                  </Checkbox>
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
                          {{ postContentTypeDefaultValue === postFormat ? $t('settings.instance_default_simple') : '' }}
                        </option>
                      </select>
                      <i class="icon-down-open" />
                    </label>
                  </div>
                </li>
                <li>
                  <Checkbox v-model="minimalScopesMode">
                    {{ $t('settings.minimal_scopes_mode') }} {{ $t('settings.instance_default', { value: minimalScopesModeLocalizedValue }) }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="autohideFloatingPostButton">
                    {{ $t('settings.autohide_floating_post_button') }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="padEmoji">
                    {{ $t('settings.pad_emoji') }}
                  </Checkbox>
                </li>
              </ul>
            </div>

            <div class="setting-item">
              <h2>{{ $t('settings.attachments') }}</h2>
              <ul class="setting-list">
                <li>
                  <Checkbox v-model="hideAttachments">
                    {{ $t('settings.hide_attachments_in_tl') }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="hideAttachmentsInConv">
                    {{ $t('settings.hide_attachments_in_convo') }}
                  </Checkbox>
                </li>
                <li>
                  <label for="maxThumbnails">
                    {{ $t('settings.max_thumbnails') }}
                  </label>
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
                  <Checkbox v-model="hideNsfw">
                    {{ $t('settings.nsfw_clickthrough') }}
                  </Checkbox>
                </li>
                <ul class="setting-list suboptions">
                  <li>
                    <Checkbox
                      v-model="preloadImage"
                      :disabled="!hideNsfw"
                    >
                      {{ $t('settings.preload_images') }}
                    </Checkbox>
                  </li>
                  <li>
                    <Checkbox
                      v-model="useOneClickNsfw"
                      :disabled="!hideNsfw"
                    >
                      {{ $t('settings.use_one_click_nsfw') }}
                    </Checkbox>
                  </li>
                </ul>
                <li>
                  <Checkbox v-model="stopGifs">
                    {{ $t('settings.stop_gifs') }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="loopVideo">
                    {{ $t('settings.loop_video') }}
                  </Checkbox>
                  <ul
                    class="setting-list suboptions"
                    :class="[{disabled: !streaming}]"
                  >
                    <li>
                      <Checkbox
                        v-model="loopVideoSilentOnly"
                        :disabled="!loopVideo || !loopSilentAvailable"
                      >
                        {{ $t('settings.loop_video_silent_only') }}
                      </Checkbox>
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
                  <Checkbox v-model="playVideosInModal">
                    {{ $t('settings.play_videos_in_modal') }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="useContainFit">
                    {{ $t('settings.use_contain_fit') }}
                  </Checkbox>
                </li>
              </ul>
            </div>

            <div class="setting-item">
              <h2>{{ $t('settings.notifications') }}</h2>
              <ul class="setting-list">
                <li>
                  <Checkbox v-model="webPushNotifications">
                    {{ $t('settings.enable_web_push_notifications') }}
                  </Checkbox>
                </li>
              </ul>
            </div>

            <div class="setting-item">
              <h2>{{ $t('settings.fun') }}</h2>
              <ul class="setting-list">
                <li>
                  <Checkbox v-model="greentext">
                    {{ $t('settings.greentext') }} {{ $t('settings.instance_default', { value: greentextLocalizedValue }) }}
                  </Checkbox>
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
