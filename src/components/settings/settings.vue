<template>
<div class="settings panel panel-default">
  <div class="panel-heading">
    <div class="title">
      {{$t('settings.settings')}}
    </div>

    <transition name="fade">
      <template v-if="currentSaveStateNotice">
        <div @click.prevent class="alert error" v-if="currentSaveStateNotice.error">
          {{ $t('settings.saving_err') }}
        </div>

        <div @click.prevent class="alert transparent" v-if="!currentSaveStateNotice.error">
          {{ $t('settings.saving_ok') }}
        </div>
      </template>
    </transition>
  </div>
  <div class="panel-body">
<keep-alive>
    <tab-switcher>
      <div :label="$t('settings.general')" >
        <div class="setting-item">
          <h2>{{ $t('settings.interface') }}</h2>
          <ul class="setting-list">
            <li>
              <interface-language-switcher />
            </li>
            <li>
              <input type="checkbox" id="hideISP" v-model="hideISPLocal">
              <label for="hideISP">{{$t('settings.hide_isp')}}</label>
            </li>
          </ul>
        </div>
        <div class="setting-item">
          <h2>{{$t('nav.timeline')}}</h2>
          <ul class="setting-list">
            <li>
              <input type="checkbox" id="collapseMessageWithSubject" v-model="collapseMessageWithSubjectLocal">
              <label for="collapseMessageWithSubject">
                {{$t('settings.collapse_subject')}} {{$t('settings.instance_default', { value: collapseMessageWithSubjectDefault })}}
              </label>
            </li>
            <li>
              <input type="checkbox" id="streaming" v-model="streamingLocal">
              <label for="streaming">{{$t('settings.streaming')}}</label>
              <ul class="setting-list suboptions" :class="[{disabled: !streamingLocal}]">
                <li>
                  <input :disabled="!streamingLocal" type="checkbox" id="pauseOnUnfocused" v-model="pauseOnUnfocusedLocal">
                  <label for="pauseOnUnfocused">{{$t('settings.pause_on_unfocused')}}</label>
                </li>
              </ul>
            </li>
            <li>
              <input type="checkbox" id="autoload" v-model="autoLoadLocal">
              <label for="autoload">{{$t('settings.autoload')}}</label>
            </li>
            <li>
              <input type="checkbox" id="hoverPreview" v-model="hoverPreviewLocal">
              <label for="hoverPreview">{{$t('settings.reply_link_preview')}}</label>
            </li>
          </ul>
        </div>

        <div class="setting-item">
          <h2>{{$t('settings.composing')}}</h2>
          <ul class="setting-list">
            <li>
              <input type="checkbox" id="scopeCopy" v-model="scopeCopyLocal">
              <label for="scopeCopy">
                {{$t('settings.scope_copy')}} {{$t('settings.instance_default', { value: scopeCopyDefault })}}
              </label>
            </li>
            <li>
              <input type="checkbox" id="subjectHide" v-model="alwaysShowSubjectInputLocal">
              <label for="subjectHide">
                {{$t('settings.subject_input_always_show')}} {{$t('settings.instance_default', { value: alwaysShowSubjectInputDefault })}}
              </label>
            </li>
            <li>
              <div>
                {{$t('settings.subject_line_behavior')}}
                <label for="subjectLineBehavior" class="select">
                  <select id="subjectLineBehavior" v-model="subjectLineBehaviorLocal">
                    <option value="email">
                      {{$t('settings.subject_line_email')}}
                      {{subjectLineBehaviorDefault == 'email' ? $t('settings.instance_default_simple') : ''}}
                    </option>
                    <option value="masto">
                      {{$t('settings.subject_line_mastodon')}}
                      {{subjectLineBehaviorDefault == 'mastodon' ? $t('settings.instance_default_simple') : ''}}
                    </option>
                    <option value="noop">
                      {{$t('settings.subject_line_noop')}}
                      {{subjectLineBehaviorDefault == 'noop' ? $t('settings.instance_default_simple') : ''}}
                    </option>
                  </select>
                  <i class="icon-down-open"/>
                </label>
              </div>
            </li>
          </ul>
        </div>

        <div class="setting-item">
          <h2>{{$t('settings.attachments')}}</h2>
          <ul class="setting-list">
            <li>
              <input type="checkbox" id="hideAttachments" v-model="hideAttachmentsLocal">
              <label for="hideAttachments">{{$t('settings.hide_attachments_in_tl')}}</label>
            </li>
            <li>
              <input type="checkbox" id="hideAttachmentsInConv" v-model="hideAttachmentsInConvLocal">
              <label for="hideAttachmentsInConv">{{$t('settings.hide_attachments_in_convo')}}</label>
            </li>
            <li>
              <input type="checkbox" id="hideNsfw" v-model="hideNsfwLocal">
              <label for="hideNsfw">{{$t('settings.nsfw_clickthrough')}}</label>
            </li>
            <ul class="setting-list suboptions" >
              <li>
                <input :disabled="!hideNsfwLocal" type="checkbox" id="preloadImage" v-model="preloadImage">
                <label for="preloadImage">{{$t('settings.preload_images')}}</label>
              </li>
              <li>
                <input type="checkbox" id="useOneClickNsfw" v-model="useOneClickNsfw">
                <label for="useOneClickNsfw">{{$t('settings.use_one_click_nsfw')}}</label>
              </li>
            </ul>
            <li>
              <input type="checkbox" id="stopGifs" v-model="stopGifs">
              <label for="stopGifs">{{$t('settings.stop_gifs')}}</label>
            </li>
            <li>
              <input type="checkbox" id="loopVideo" v-model="loopVideoLocal">
              <label for="loopVideo">{{$t('settings.loop_video')}}</label>
              <ul class="setting-list suboptions" :class="[{disabled: !streamingLocal}]">
                <li>
                  <input :disabled="!loopVideoLocal || !loopSilentAvailable" type="checkbox" id="loopVideoSilentOnly" v-model="loopVideoSilentOnlyLocal">
                  <label for="loopVideoSilentOnly">{{$t('settings.loop_video_silent_only')}}</label>
                  <div v-if="!loopSilentAvailable" class="unavailable">
                    <i class="icon-globe"/>! {{$t('settings.limited_availability')}}
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <input type="checkbox" id="playVideosInline" v-model="playVideosInline">
              <label for="playVideosInline">{{$t('settings.play_videos_inline')}}</label>
            </li>
            <li>
              <input type="checkbox" id="useContainFit" v-model="useContainFit">
              <label for="useContainFit">{{$t('settings.use_contain_fit')}}</label>
            </li>
          </ul>
        </div>

       <div class="setting-item">
          <h2>{{$t('settings.notifications')}}</h2>
          <ul class="setting-list">
            <li>
              <input type="checkbox" id="webPushNotifications" v-model="webPushNotificationsLocal">
              <label for="webPushNotifications">
                {{$t('settings.enable_web_push_notifications')}}
              </label>
            </li>
          </ul>
        </div>
      </div>

      <div :label="$t('settings.theme')" >
        <div class="setting-item">
          <style-switcher></style-switcher>
        </div>
      </div>

      <div :label="$t('settings.filtering')" >
        <div class="setting-item">
          <div class="select-multiple">
            <span class="label">{{$t('settings.notification_visibility')}}</span>
            <ul class="option-list">
              <li>
                <input type="checkbox" id="notification-visibility-likes" v-model="notificationVisibilityLocal.likes">
                <label for="notification-visibility-likes">
                  {{$t('settings.notification_visibility_likes')}}
                </label>
              </li>
              <li>
                <input type="checkbox" id="notification-visibility-repeats" v-model="notificationVisibilityLocal.repeats">
                <label for="notification-visibility-repeats">
                {{$t('settings.notification_visibility_repeats')}}
                </label>
              </li>
              <li>
                <input type="checkbox" id="notification-visibility-follows" v-model="notificationVisibilityLocal.follows">
                <label for="notification-visibility-follows">
                {{$t('settings.notification_visibility_follows')}}
                </label>
              </li>
              <li>
                <input type="checkbox" id="notification-visibility-mentions" v-model="notificationVisibilityLocal.mentions">
                <label for="notification-visibility-mentions">
                {{$t('settings.notification_visibility_mentions')}}
                </label>
              </li>
            </ul>
            </label>
          </div>
          <div>
            {{$t('settings.replies_in_timeline')}}
            <label for="replyVisibility" class="select">
              <select id="replyVisibility" v-model="replyVisibilityLocal">
                <option value="all" selected>{{$t('settings.reply_visibility_all')}}</option>
                <option value="following">{{$t('settings.reply_visibility_following')}}</option>
                <option value="self">{{$t('settings.reply_visibility_self')}}</option>
              </select>
              <i class="icon-down-open"/>
            </label>
          </div>
          <div>
            <input type="checkbox" id="hidePostStats" v-model="hidePostStatsLocal">
            <label for="hidePostStats">
              {{$t('settings.hide_post_stats')}} {{$t('settings.instance_default', { value: hidePostStatsDefault })}}
            </label>
          </div>
          <div>
            <input type="checkbox" id="hideUserStats" v-model="hideUserStatsLocal">
            <label for="hideUserStats">
              {{$t('settings.hide_user_stats')}} {{$t('settings.instance_default', { value: hideUserStatsDefault })}}
            </label>
          </div>
        </div>
        <div class="setting-item">
          <p>{{$t('settings.filtering_explanation')}}</p>
          <textarea id="muteWords" v-model="muteWordsString"></textarea>
        </div>
      </div>

    </tab-switcher>
</keep-alive>
  </div>
</div>
</template>

<script src="./settings.js">
</script>

<style lang="scss">
@import '../../_variables.scss';

.setting-item {
  border-bottom: 2px solid var(--fg, $fallback--fg);
  margin: 1em 1em 1.4em;
  padding-bottom: 1.4em;

  > div {
    margin-bottom: .5em;
    &:last-child {
      margin-bottom: 0;
    }
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 1em;
  }

  select {
    min-width: 10em;
  }


  textarea {
    width: 100%;
    height: 100px;
  }

  .unavailable,
  .unavailable i {
    color: var(--cRed, $fallback--cRed);
    color: $fallback--cRed;
  }

  .old-avatar {
    width: 128px;
    border-radius: $fallback--avatarRadius;
    border-radius: var(--avatarRadius, $fallback--avatarRadius);
  }

  .new-avatar {
    object-fit: cover;
    width: 128px;
    height: 128px;
    border-radius: $fallback--avatarRadius;
    border-radius: var(--avatarRadius, $fallback--avatarRadius);
  }

  .btn {
    min-height: 28px;
    min-width: 10em;
    padding: 0 2em;
  }
}
.select-multiple {
  display: flex;
  .option-list {
    margin: 0;
    padding-left: .5em;
  }
}
.setting-list,
.option-list{
  list-style-type: none;
  padding-left: 2em;
  li {
    margin-bottom: 0.5em;
  }
  .suboptions {
    margin-top: 0.3em
  }
}
</style>
