<template>
  <div class="post-status-form">
    <form @submit.prevent="postStatus(newStatus)">
      <div class="form-group">
        <i18n
          v-if="!$store.state.users.currentUser.locked && newStatus.visibility == 'private'"
          path="post_status.account_not_locked_warning"
          tag="p"
          class="visibility-notice"
        >
          <router-link :to="{ name: 'user-settings' }">
            {{ $t('post_status.account_not_locked_warning_link') }}
          </router-link>
        </i18n>
        <p
          v-if="newStatus.visibility === 'direct'"
          class="visibility-notice"
        >
          <span v-if="safeDMEnabled">{{ $t('post_status.direct_warning_to_first_only') }}</span>
          <span v-else>{{ $t('post_status.direct_warning_to_all') }}</span>
        </p>
        <EmojiInput
          v-if="newStatus.spoilerText || alwaysShowSubject"
          v-model="newStatus.spoilerText"
          type="text"
          :placeholder="$t('post_status.content_warning')"
          classname="form-control"
        />
        <textarea
          ref="textarea"
          v-model="newStatus.status"
          :placeholder="$t('post_status.default')"
          rows="1"
          class="form-control"
          :disabled="posting"
          @click="setCaret"
          @keyup.exact="setCaret"
          @keydown.exact="onKeydown"
          @keydown.exact.down="cycleForward"
          @keydown.exact.up="cycleBackward"
          @keydown.exact.shift.tab="cycleBackward"
          @keydown.exact.tab="cycleForward"
          @keydown.exact.enter="replaceCandidate"
          @keydown.exact.meta.enter="postStatus(newStatus)"
          @keyup.exact.ctrl.enter="postStatus(newStatus)"
          @drop="fileDrop"
          @dragover.prevent="fileDrag"
          @input="resize"
          @paste="paste"
        />
        <div class="visibility-tray">
          <span
            v-if="formattingOptionsEnabled"
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
          </span>

          <scope-selector
            :show-all="showAllScopes"
            :user-default="userDefaultScope"
            :original-scope="copyMessageScope"
            :initial-scope="newStatus.visibility"
            :on-scope-change="changeVis"
          />
        </div>
      </div>
      <div
        v-if="candidates"
        class="autocomplete-panel"
      >
        <div class="autocomplete-panel-body">
          <div
            v-for="(candidate, index) in candidates"
            :key="index"
            class="autocomplete-item"
            :class="{ highlighted: candidate.highlighted }"
            @click="replace(candidate.utf || (candidate.screen_name + ' '))"
          >
            <span v-if="candidate.img"><img :src="candidate.img"></span>
            <span v-else>{{ candidate.utf }}</span>
            <span>{{ candidate.screen_name }}<small>{{ candidate.name }}</small></span>
          </div>
        </div>
      </div>
      <div class="form-bottom">
        <media-upload
          ref="mediaUpload"
          :drop-files="dropFiles"
          @uploading="disableSubmit"
          @uploaded="addMediaFile"
          @upload-failed="uploadFailed"
        />

        <p
          v-if="isOverLengthLimit"
          class="error"
        >
          {{ charactersLeft }}
        </p>
        <p
          v-else-if="hasStatusLengthLimit"
          class="faint"
        >
          {{ charactersLeft }}
        </p>

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
        <button
          v-else
          :disabled="submitDisabled"
          type="submit"
          class="btn btn-default"
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
          <div class="media-upload-container attachment">
            <img
              v-if="type(file) === 'image'"
              class="thumbnail media-upload"
              :src="file.url"
            >
            <video
              v-if="type(file) === 'video'"
              :src="file.url"
              controls
            />
            <audio
              v-if="type(file) === 'audio'"
              :src="file.url"
              controls
            />
            <a
              v-if="type(file) === 'unknown'"
              :href="file.url"
            >{{ file.url }}</a>
          </div>
        </div>
      </div>
      <div
        v-if="newStatus.files.length > 0"
        class="upload_settings"
      >
        <input
          id="filesSensitive"
          v-model="newStatus.nsfw"
          type="checkbox"
        >
        <label for="filesSensitive">{{ $t('post_status.attachments_sensitive') }}</label>
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
  .visibility-tray {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }
}

.post-status-form, .login {
  .form-bottom {
    display: flex;
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

  .error {
    text-align: center;
  }

  .media-upload-wrapper {
    flex: 0 0 auto;
    max-width: 100%;
    min-width: 50px;
    margin-right: .2em;
    margin-bottom: .5em;

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
  }

  .attachments {
    padding: 0 0.5em;

    .attachment {
      margin: 0;
      position: relative;
      flex: 0 0 auto;
      border: 1px solid $fallback--border;
      border: 1px solid var(--border, $fallback--border);
      text-align: center;

      audio {
        min-width: 300px;
        flex: 1 0 auto;
      }

      a {
        display: block;
        text-align: left;
        line-height: 1.2;
        padding: .5em;
      }
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
    padding: 0.6em;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    padding: 0.3em 0.5em 0.6em;
    line-height:24px;
  }

  form textarea.form-cw {
    line-height:16px;
    resize: none;
    overflow: hidden;
    transition: min-height 200ms 100ms;
    min-height: 1px;
  }

  form textarea.form-control {
    line-height:16px;
    resize: none;
    overflow: hidden;
    transition: min-height 200ms 100ms;
    min-height: 1px;
    box-sizing: content-box;
  }

  form textarea.form-control:focus {
    min-height: 48px;
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
}
</style>
