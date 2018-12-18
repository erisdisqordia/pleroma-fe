<template>
<div class="post-status-form">
  <form @submit.prevent="postStatus(newStatus)">
    <div class="form-group" >
      <i18n
        v-if="!this.$store.state.users.currentUser.locked && this.newStatus.visibility == 'private'"
        path="post_status.account_not_locked_warning"
        tag="p"
        class="visibility-notice">
        <router-link :to="{ name: 'user-settings' }">{{ $t('post_status.account_not_locked_warning_link') }}</router-link>
      </i18n>
      <p v-if="this.newStatus.visibility == 'direct'" class="visibility-notice">{{ $t('post_status.direct_warning') }}</p>
      <input
        v-if="newStatus.spoilerText || alwaysShowSubject"
        type="text"
        :placeholder="$t('post_status.content_warning')"
        v-model="newStatus.spoilerText"
        class="form-cw">
      <textarea
        ref="textarea"
        @click="setCaret"
        @keyup="setCaret" v-model="newStatus.status" :placeholder="$t('post_status.default')" rows="1" class="form-control"
        @keydown.down="cycleForward"
        @keydown.up="cycleBackward"
        @keydown.shift.tab="cycleBackward"
        @keydown.tab="cycleForward"
        @keydown.enter="replaceCandidate"
        @keydown.meta.enter="postStatus(newStatus)"
        @keyup.ctrl.enter="postStatus(newStatus)"
        @drop="fileDrop"
        @dragover.prevent="fileDrag"
        @input="resize"
        @paste="paste">
      </textarea>
      <div class="visibility-tray">
        <span class="text-format" v-if="formattingOptionsEnabled">
          <label for="post-content-type" class="select">
            <select id="post-content-type" v-model="newStatus.contentType" class="form-control">
              <option value="text/plain">{{$t('post_status.content_type.plain_text')}}</option>
              <option value="text/html">HTML</option>
              <option value="text/markdown">Markdown</option>
            </select>
            <i class="icon-down-open"></i>
          </label>
        </span>

        <div v-if="scopeOptionsEnabled">
          <i v-on:click="changeVis('direct')" class="icon-mail-alt" :class="vis.direct" :title="$t('post_status.scope.direct')"></i>
          <i v-on:click="changeVis('private')" class="icon-lock" :class="vis.private" :title="$t('post_status.scope.private')"></i>
          <i v-on:click="changeVis('unlisted')" class="icon-lock-open-alt" :class="vis.unlisted" :title="$t('post_status.scope.unlisted')"></i>
          <i v-on:click="changeVis('public')" class="icon-globe" :class="vis.public" :title="$t('post_status.scope.public')"></i>
        </div>
      </div>
    </div>
    <div style="position:relative;" v-if="candidates">
        <div class="autocomplete-panel">
          <div v-for="candidate in candidates" @click="replace(candidate.utf || (candidate.screen_name + ' '))">
            <div class="autocomplete" :class="{ highlighted: candidate.highlighted }">
              <span v-if="candidate.img"><img :src="candidate.img"></img></span>
              <span v-else>{{candidate.utf}}</span>
              <span>{{candidate.screen_name}}<small>{{candidate.name}}</small></span>
            </div>
          </div>
        </div>
      </div>
      <div class='form-bottom'>
        <media-upload @uploading="disableSubmit" @uploaded="addMediaFile" @upload-failed="uploadFailed" :drop-files="dropFiles"></media-upload>

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
            <img class="thumbnail media-upload" :src="file.image" v-if="type(file) === 'image'"></img>
            <video v-if="type(file) === 'video'" :src="file.image" controls></video>
            <audio v-if="type(file) === 'audio'" :src="file.image" controls></audio>
            <a v-if="type(file) === 'unknown'" :href="file.image">{{file.url}}</a>
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

  .autocomplete-panel {
    margin: 0 0.5em 0 0.5em;
    border-radius: $fallback--tooltipRadius;
    border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
    position: absolute;
    z-index: 1;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
    // this doesn't match original but i don't care, making it uniform.
    box-shadow: var(--popupShadow);
    min-width: 75%;
    background: $fallback--bg;
    background: var(--bg, $fallback--bg);
    color: $fallback--lightText;
    color: var(--lightText, $fallback--lightText);
  }

  .autocomplete {
    cursor: pointer;
    padding: 0.2em 0.4em 0.2em 0.4em;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    display: flex;

    img {
      width: 24px;
      height: 24px;
      border-radius: $fallback--avatarRadius;
      border-radius: var(--avatarRadius, $fallback--avatarRadius);
      object-fit: contain;
    }

    span {
      line-height: 24px;
      margin: 0 0.1em 0 0.2em;
    }

    small {
      margin-left: .5em;
      color: $fallback--faint;
      color: var(--faint, $fallback--faint);
    }

    &.highlighted {
      background-color: $fallback--fg;
      background-color: var(--lightBg, $fallback--fg);
    }
  }
}
</style>
