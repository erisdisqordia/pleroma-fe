<template>
  <div
    ref="form"
    class="post-status-form"
  >
    <form
      autocomplete="off"
      @submit.prevent
      @dragover.prevent="fileDrag"
    >
      <div
        v-show="showDropIcon !== 'hide'"
        :style="{ animation: showDropIcon === 'show' ? 'fade-in 0.25s' : 'fade-out 0.5s' }"
        class="drop-indicator"
        :class="[uploadFileLimitReached ? 'icon-block' : 'icon-upload']"
        @dragleave="fileDragStop"
        @drop.stop="fileDrop"
      />
      <div class="form-group">
        <i18n
          v-if="!$store.state.users.currentUser.locked && newStatus.visibility == 'private' && !disableLockWarning"
          path="post_status.account_not_locked_warning"
          tag="p"
          class="visibility-notice"
        >
          <router-link :to="{ name: 'user-settings' }">
            {{ $t('post_status.account_not_locked_warning_link') }}
          </router-link>
        </i18n>
        <p
          v-if="!hideScopeNotice && newStatus.visibility === 'public'"
          class="visibility-notice notice-dismissible"
        >
          <span>{{ $t('post_status.scope_notice.public') }}</span>
          <a
            class="button-icon dismiss"
            @click.prevent="dismissScopeNotice()"
          >
            <i class="icon-cancel" />
          </a>
        </p>
        <p
          v-else-if="!hideScopeNotice && newStatus.visibility === 'unlisted'"
          class="visibility-notice notice-dismissible"
        >
          <span>{{ $t('post_status.scope_notice.unlisted') }}</span>
          <a
            class="button-icon dismiss"
            @click.prevent="dismissScopeNotice()"
          >
            <i class="icon-cancel" />
          </a>
        </p>
        <p
          v-else-if="!hideScopeNotice && newStatus.visibility === 'private' && $store.state.users.currentUser.locked"
          class="visibility-notice notice-dismissible"
        >
          <span>{{ $t('post_status.scope_notice.private') }}</span>
          <a
            class="button-icon dismiss"
            @click.prevent="dismissScopeNotice()"
          >
            <i class="icon-cancel" />
          </a>
        </p>
        <p
          v-else-if="newStatus.visibility === 'direct'"
          class="visibility-notice"
        >
          <span v-if="safeDMEnabled">{{ $t('post_status.direct_warning_to_first_only') }}</span>
          <span v-else>{{ $t('post_status.direct_warning_to_all') }}</span>
        </p>
        <div
          v-if="!disablePreview"
          class="preview-heading faint"
        >
          <a
            class="preview-toggle faint"
            @click.stop.prevent="togglePreview"
          >
            {{ $t('post_status.preview') }}
            <i
              class="icon-down-open"
              :style="{ transform: showPreview ? 'rotate(0deg)' : 'rotate(-90deg)' }"
            />
          </a>
          <i
            v-show="previewLoading"
            class="icon-spin3 animate-spin"
          />
        </div>
        <div
          v-if="showPreview"
          class="preview-container"
        >
          <div
            v-if="!preview"
            class="preview-status"
          >
            {{ $t('general.loading') }}
          </div>
          <div
            v-else-if="preview.error"
            class="preview-status preview-error"
          >
            {{ preview.error }}
          </div>
          <StatusContent
            v-else
            :status="preview"
            class="preview-status"
          />
        </div>
        <EmojiInput
          v-if="!disableSubject && (newStatus.spoilerText || alwaysShowSubject)"
          v-model="newStatus.spoilerText"
          enable-emoji-picker
          :suggest="emojiSuggestor"
          class="form-control"
        >
          <input
            v-model="newStatus.spoilerText"
            type="text"
            :placeholder="$t('post_status.content_warning')"
            :disabled="posting"
            class="form-post-subject"
          >
        </EmojiInput>
        <EmojiInput
          ref="emoji-input"
          v-model="newStatus.status"
          :suggest="emojiUserSuggestor"
          :placement="emojiPickerPlacement"
          class="form-control main-input"
          enable-emoji-picker
          hide-emoji-button
          :newline-on-ctrl-enter="submitOnEnter"
          enable-sticker-picker
          @input="onEmojiInputInput"
          @sticker-uploaded="addMediaFile"
          @sticker-upload-failed="uploadFailed"
          @shown="handleEmojiInputShow"
        >
          <textarea
            ref="textarea"
            v-model="newStatus.status"
            :placeholder="placeholder || $t('post_status.default')"
            rows="1"
            :disabled="posting"
            class="form-post-body"
            :class="{ 'scrollable-form': !!maxHeight }"
            @keydown.exact.enter="submitOnEnter && postStatus($event, newStatus)"
            @keydown.meta.enter="postStatus($event, newStatus)"
            @keydown.ctrl.enter="!submitOnEnter && postStatus($event, newStatus)"
            @input="resize"
            @compositionupdate="resize"
            @paste="paste"
          />
          <p
            v-if="hasStatusLengthLimit"
            class="character-counter faint"
            :class="{ error: isOverLengthLimit }"
          >
            {{ charactersLeft }}
          </p>
        </EmojiInput>
        <div
          v-if="!disableScopeSelector"
          class="visibility-tray"
        >
          <scope-selector
            :show-all="showAllScopes"
            :user-default="userDefaultScope"
            :original-scope="copyMessageScope"
            :initial-scope="newStatus.visibility"
            :on-scope-change="changeVis"
          />

          <div
            v-if="postFormats.length > 1"
            class="text-format"
          >
            <label
              for="post-content-type"
              class="select"
            >
              <select
                id="post-content-type"
                v-model="newStatus.contentType"
                class="form-control"
              >
                <option
                  v-for="postFormat in postFormats"
                  :key="postFormat"
                  :value="postFormat"
                >
                  {{ $t(`post_status.content_type["${postFormat}"]`) }}
                </option>
              </select>
              <i class="icon-down-open" />
            </label>
          </div>
          <div
            v-if="postFormats.length === 1 && postFormats[0] !== 'text/plain'"
            class="text-format"
          >
            <span class="only-format">
              {{ $t(`post_status.content_type["${postFormats[0]}"]`) }}
            </span>
          </div>
        </div>
      </div>
      <poll-form
        v-if="pollsAvailable"
        ref="pollForm"
        :visible="pollFormVisible"
        @update-poll="setPoll"
      />
      <div
        ref="bottom"
        class="form-bottom"
      >
        <div class="form-bottom-left">
          <media-upload
            ref="mediaUpload"
            class="media-upload-icon"
            :drop-files="dropFiles"
            :disabled="uploadFileLimitReached"
            @uploading="startedUploadingFiles"
            @uploaded="addMediaFile"
            @upload-failed="uploadFailed"
            @all-uploaded="finishedUploadingFiles"
          />
          <div
            class="emoji-icon"
          >
            <i
              :title="$t('emoji.add_emoji')"
              class="icon-smile btn btn-default"
              @click="showEmojiPicker"
            />
          </div>
          <div
            v-if="pollsAvailable"
            class="poll-icon"
            :class="{ selected: pollFormVisible }"
          >
            <i
              :title="$t('polls.add_poll')"
              class="icon-chart-bar btn btn-default"
              @click="togglePollForm"
            />
          </div>
        </div>
        <button
          v-if="posting"
          disabled
          class="btn btn-default"
        >
          {{ $t('post_status.posting') }}
        </button>
        <button
          v-else-if="isOverLengthLimit"
          disabled
          class="btn btn-default"
        >
          {{ $t('general.submit') }}
        </button>
        <!-- touchstart is used to keep the OSK at the same position after a message send -->
        <button
          v-else
          :disabled="uploadingFiles || disableSubmit"
          class="btn btn-default"
          @touchstart.stop.prevent="postStatus($event, newStatus)"
          @click.stop.prevent="postStatus($event, newStatus)"
        >
          {{ $t('general.submit') }}
        </button>
      </div>
      <div
        v-if="error"
        class="alert error"
      >
        Error: {{ error }}
        <i
          class="button-icon icon-cancel"
          @click="clearError"
        />
      </div>
      <div class="attachments">
        <div
          v-for="file in newStatus.files"
          :key="file.url"
          class="media-upload-wrapper"
        >
          <i
            class="fa button-icon icon-cancel"
            @click="removeMediaFile(file)"
          />
          <attachment
            :attachment="file"
            :set-media="() => $store.dispatch('setMedia', newStatus.files)"
            size="small"
            allow-play="false"
          />
          <input
            v-model="newStatus.mediaDescriptions[file.id]"
            type="text"
            :placeholder="$t('post_status.media_description')"
            @keydown.enter.prevent=""
          >
        </div>
      </div>
      <div
        v-if="newStatus.files.length > 0 && !disableSensitivityCheckbox"
        class="upload_settings"
      >
        <Checkbox v-model="newStatus.nsfw">
          {{ $t('post_status.attachments_sensitive') }}
        </Checkbox>
      </div>
    </form>
  </div>
</template>

<script src="./post_status_form.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.tribute-container {
  ul {
    padding: 0px;
    li {
      display: flex;
      align-items: center;
    }
  }
  img {
    padding: 3px;
    width: 16px;
    height: 16px;
    border-radius: $fallback--avatarAltRadius;
    border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);
  }
}

.post-status-form {
  position: relative;

  .form-bottom {
    display: flex;
    justify-content: space-between;
    padding: 0.5em;
    height: 32px;

    button {
      width: 10em;
    }

    p {
      margin: 0.35em;
      padding: 0.35em;
      display: flex;
    }
  }

  .form-bottom-left {
    display: flex;
    flex: 1;
    padding-right: 7px;
    margin-right: 7px;
    max-width: 10em;
  }

  .preview-heading {
    display: flex;
    width: 100%;

    .icon-spin3 {
      margin-left: auto;
    }
  }

  .preview-toggle {
    display: flex;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .icon-down-open {
    transition: transform 0.1s;
  }

  .preview-container {
    margin-bottom: 1em;
  }

  .preview-error {
    font-style: italic;
    color: $fallback--faint;
    color: var(--faint, $fallback--faint);
  }

  .preview-status {
    border: 1px solid $fallback--border;
    border: 1px solid var(--border, $fallback--border);
    border-radius: $fallback--tooltipRadius;
    border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
    padding: 0.5em;
    margin: 0;
    line-height: 1.4em;
  }

  .text-format {
    .only-format {
      color: $fallback--faint;
      color: var(--faint, $fallback--faint);
    }
  }

  .visibility-tray {
    display: flex;
    justify-content: space-between;
    padding-top: 5px;
  }

  .media-upload-icon, .poll-icon, .emoji-icon {
    font-size: 26px;
    flex: 1;

    &.selected, &:hover {
      // needs to be specific to override icon default color
      i, label {
        color: $fallback--lightText;
        color: var(--lightText, $fallback--lightText);
      }
    }

    &.disabled {
      i {
        cursor: not-allowed;
        color: $fallback--icon;
        color: var(--btnDisabledText, $fallback--icon);

        &:hover {
          color: $fallback--icon;
          color: var(--btnDisabledText, $fallback--icon);
        }
      }
    }
  }

  // Order is not necessary but a good indicator
  .media-upload-icon {
    order: 1;
    text-align: left;
  }

  .emoji-icon {
    order: 2;
    text-align: center;
  }

  .poll-icon {
    order: 3;
    text-align: right;
  }

  .icon-chart-bar {
    cursor: pointer;
  }

  .error {
    text-align: center;
  }

  .media-upload-wrapper {
    margin-right: .2em;
    margin-bottom: .5em;
    width: 18em;

    .icon-cancel {
      display: inline-block;
      position: static;
      margin: 0;
      padding-bottom: 0;
      margin-left: $fallback--attachmentRadius;
      margin-left: var(--attachmentRadius, $fallback--attachmentRadius);
      background-color: $fallback--fg;
      background-color: var(--btn, $fallback--fg);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    img, video {
      object-fit: contain;
      max-height: 10em;
    }

    .video {
      max-height: 10em;
    }

    input {
      flex: 1;
      width: 100%;
    }
  }

  .status-input-wrapper {
    display: flex;
    position: relative;
    width: 100%;
    flex-direction: column;
  }

  .media-upload-wrapper .attachments {
    padding: 0 0.5em;

    .attachment {
      margin: 0;
      padding: 0;
      position: relative;
    }

    i {
      position: absolute;
      margin: 10px;
      padding: 5px;
      background: rgba(230,230,230,0.6);
      border-radius: $fallback--attachmentRadius;
      border-radius: var(--attachmentRadius, $fallback--attachmentRadius);
      font-weight: bold;
    }
  }

  .btn {
    cursor: pointer;
  }

  .btn[disabled] {
    cursor: not-allowed;
  }

  form {
    display: flex;
    flex-direction: column;
    margin: 0.6em;
    position: relative;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    padding: 0.25em 0.5em 0.5em;
    line-height:24px;
  }

  form textarea.form-cw {
    line-height:16px;
    resize: none;
    overflow: hidden;
    transition: min-height 200ms 100ms;
    min-height: 1px;
  }

  .form-post-body {
    height: 16px; // Only affects the empty-height
    line-height: 16px;
    resize: none;
    overflow: hidden;
    transition: min-height 200ms 100ms;
    padding-bottom: 1.75em;
    min-height: 1px;
    box-sizing: content-box;

    &.scrollable-form {
      overflow-y: auto;
    }
  }

  .main-input {
    position: relative;
  }

  .character-counter {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0;
    margin: 0 0.5em;

    &.error {
      color: $fallback--cRed;
      color: var(--cRed, $fallback--cRed);
    }
  }

  .btn {
    cursor: pointer;
  }

  .btn[disabled] {
    cursor: not-allowed;
  }

  .icon-cancel {
    cursor: pointer;
    z-index: 4;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 0.6; }
  }

  @keyframes fade-out {
    from { opacity: 0.6; }
    to   { opacity: 0; }
  }

  .drop-indicator {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    font-size: 5em;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    color: $fallback--text;
    color: var(--text, $fallback--text);
    background-color: $fallback--bg;
    background-color: var(--bg, $fallback--bg);
    border-radius: $fallback--tooltipRadius;
    border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
    border: 2px dashed $fallback--text;
    border: 2px dashed var(--text, $fallback--text);
  }
}

// todo: unify with attachment.vue (otherwise the uploaded images are not minified unless a status with an attachment was displayed before)
img.media-upload, .media-upload-container > video {
  line-height: 0;
  max-height: 200px;
  max-width: 100%;
}
</style>
