<template>
<div class="settings panel panel-default">
  <div class="panel-heading">
    {{$t('settings.settings')}}
  </div>
  <div class="panel-body">
    <div class="setting-item">
      <h2>{{$t('settings.theme')}}</h2>
      <style-switcher></style-switcher>
    </div>
    <div class="setting-item">
      <h2>{{$t('settings.filtering')}}</h2>
      <p>{{$t('settings.filtering_explanation')}}</p>
      <textarea id="muteWords" v-model="muteWordsString"></textarea>
    </div>
    <div class="setting-item">
      <h2>{{$t('nav.timeline')}}</h2>
      <ul class="setting-list">
        <li>
          <input type="checkbox" id="collapseMessageWithSubject" v-model="collapseMessageWithSubjectLocal">
          <label for="collapseMessageWithSubject">{{$t('settings.collapse_subject')}}</label>
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
      </ul>
    </div>
  </div>
</div>
</template>

<script src="./settings.js">
</script>

<style lang="scss">
@import '../../_variables.scss';

.setting-item {
  border-bottom: 2px solid var(--btn, $fallback--btn);
  margin: 1em 1em 1.4em;
  padding-bottom: 1.4em;


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
    margin-top: 1em;
  }
}
.setting-list {
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
