<template>
<div class="post-status-form">
  <form @submit.prevent="postStatus(newStatus)" autocomplete="off">
    <div class="form-group" >
      <i18n
        v-if="!$store.state.users.currentUser.locked && newStatus.visibility == 'private'"
        path="post_status.account_not_locked_warning"
        tag="p"
        class="visibility-notice">
        <router-link :to="{ name: 'user-settings' }">{{ $t('post_status.account_not_locked_warning_link') }}</router-link>
      </i18n>
      <p v-if="!hideScopeNotice && newStatus.visibility === 'public'" class="visibility-notice notice-dismissible">
        <span>{{ $t('post_status.scope_notice.public') }}</span>
        <a v-on:click.prevent="dismissScopeNotice()" class="button-icon dismiss">
          <i class='icon-cancel'></i>
        </a>
      </p>
      <p v-else-if="!hideScopeNotice && newStatus.visibility === 'unlisted'" class="visibility-notice notice-dismissible">
        <span>{{ $t('post_status.scope_notice.unlisted') }}</span>
        <a v-on:click.prevent="dismissScopeNotice()" class="button-icon dismiss">
          <i class='icon-cancel'></i>
        </a>
      </p>
      <p v-else-if="!hideScopeNotice && newStatus.visibility === 'private' && $store.state.users.currentUser.locked" class="visibility-notice notice-dismissible">
        <span>{{ $t('post_status.scope_notice.private') }}</span>
        <a v-on:click.prevent="dismissScopeNotice()" class="button-icon dismiss">
          <i class='icon-cancel'></i>
        </a>
      </p>
      <p v-else-if="newStatus.visibility === 'direct'" class="visibility-notice">
        <span v-if="safeDMEnabled">{{ $t('post_status.direct_warning_to_first_only') }}</span>
        <span v-else>{{ $t('post_status.direct_warning_to_all') }}</span>
      </p>
      <EmojiInput
        v-if="newStatus.spoilerText || alwaysShowSubject"
        :suggest="emojiSuggestor"
        v-model="newStatus.spoilerText"
        class="form-control"
        >
        <input

          type="text"
          :placeholder="$t('post_status.content_warning')"
          v-model="newStatus.spoilerText"
          class="form-post-subject"
          />
      </EmojiInput>
      <EmojiInput
        :suggest="emojiUserSuggestor"
        v-model="newStatus.status"
        class="form-control"
        >
        <textarea
          ref="textarea"
          v-model="newStatus.status"
          :placeholder="$t('post_status.default')"
          rows="1"
          @keydown.meta.enter="postStatus(newStatus)"
          @keyup.ctrl.enter="postStatus(newStatus)"
          @drop="fileDrop"
          @dragover.prevent="fileDrag"
          @input="resize"
          @paste="paste"
          :disabled="posting"
          class="form-post-body"
        >
        </textarea>
      </EmojiInput>
      <div class="visibility-tray">
        <div class="text-format" v-if="postFormats.length > 1">
          <label for="post-content-type" class="select">
            <select id="post-content-type" v-model="newStatus.contentType" class="form-control">
              <option v-for="postFormat in postFormats" :key="postFormat" :value="postFormat">
                {{$t(`post_status.content_type["${postFormat}"]`)}}
              </option>
            </select>
            <i class="icon-down-open"></i>
          </label>
        </div>
        <div class="text-format" v-if="postFormats.length === 1">
          <span class="only-format">
            {{$t(`post_status.content_type["${postFormats[0]}"]`)}}
          </span>
        </div>

        <scope-selector
          :showAll="showAllScopes"
          :userDefault="userDefaultScope"
          :originalScope="copyMessageScope"
          :initialScope="newStatus.visibility"
          :onScopeChange="changeVis"/>
      </div>
    </div>
    <poll-form
      ref="pollForm"
      v-if="pollsAvailable"
      :visible="pollFormVisible"
      @update-poll="setPoll"
    />
    <div class='form-bottom'>
      <div class='form-bottom-left'>
        <media-upload ref="mediaUpload" @uploading="disableSubmit" @uploaded="addMediaFile" @upload-failed="uploadFailed" :drop-files="dropFiles"></media-upload>
        <div v-if="pollsAvailable" class="poll-icon">
          <i
            :title="$t('polls.add_poll')"
            @click="togglePollForm"
            class="icon-chart-bar btn btn-default"
            :class="pollFormVisible && 'selected'"
          />
        </div>
      </div>
      <p v-if="isOverLengthLimit" class="error">{{ charactersLeft }}</p>
      <p class="faint" v-else-if="hasStatusLengthLimit">{{ charactersLeft }}</p>

      <button v-if="posting" disabled class="btn btn-default">{{$t('post_status.posting')}}</button>
      <button v-else-if="isOverLengthLimit" disabled class="btn btn-default">{{$t('general.submit')}}</button>
      <button v-else :disabled="submitDisabled" type="submit" class="btn btn-default">{{$t('general.submit')}}</button>
    </div>
    <div class='alert error' v-if="error">
      Error: {{ error }}
      <i class="button-icon icon-cancel" @click="clearError"></i>
    </div>
    <div class="attachments">
      <div class="media-upload-wrapper" v-for="file in newStatus.files">
        <i class="fa button-icon icon-cancel" @click="removeMediaFile(file)"></i>
        <div class="media-upload-container attachment">
          <img class="thumbnail media-upload" :src="file.url" v-if="type(file) === 'image'"></img>
          <video v-if="type(file) === 'video'" :src="file.url" controls></video>
          <audio v-if="type(file) === 'audio'" :src="file.url" controls></audio>
          <a v-if="type(file) === 'unknown'" :href="file.url">{{file.url}}</a>
        </div>
      </div>
    </div>
    <div class="upload_settings" v-if="newStatus.files.length > 0">
      <input type="checkbox" id="filesSensitive" v-model="newStatus.nsfw">
      <label for="filesSensitive">{{$t('post_status.attachments_sensitive')}}</label>
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
    padding-top: 5px;
  }
}

.post-status-form {
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

  .form-bottom-left {
    display: flex;
    flex: 1;
  }

  .text-format {
    .only-format {
      color: $fallback--faint;
      color: var(--faint, $fallback--faint);
    }
  }

  .poll-icon {
    font-size: 26px;
    flex: 1;

    .selected {
      color: $fallback--lightText;
      color: var(--lightText, $fallback--lightText);
    }
  }

  .icon-chart-bar {
    cursor: pointer;
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
    line-height:16px;
    resize: none;
    overflow: hidden;
    transition: min-height 200ms 100ms;
    min-height: 1px;
    box-sizing: content-box;
  }

  .form-post-body:focus {
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
