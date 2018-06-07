<template>
<div class="post-status-form">
  <form @submit.prevent="postStatus(newStatus)">
    <div class="form-group" >
      <input
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
        <i v-on:click="changeVis('direct')" v-bind:class="vis.direct"></i>
        <i v-on:click="changeVis('private')" v-bind:class="vis.private"></i>
        <i v-on:click="changeVis('unlisted')" v-bind:class="vis.unlisted"></i>
        <i v-on:click="changeVis('public')" v-bind:class="vis.public"></i>
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
        <media-upload @uploading="disableSubmit" @uploaded="addMediaFile" @upload-failed="enableSubmit" :drop-files="dropFiles"></media-upload>

        <p v-if="isOverLengthLimit" class="error">{{ charactersLeft }}</p>
        <p class="faint" v-else-if="hasStatusLengthLimit">{{ charactersLeft }}</p>

        <button v-if="posting" disabled class="btn btn-default">{{$t('post_status.posting')}}</button>
        <button v-else-if="isOverLengthLimit" disabled class="btn btn-default">{{$t('general.submit')}}</button>
        <button v-else :disabled="submitDisabled" type="submit" class="btn btn-default">{{$t('general.submit')}}</button>
      </div>
      <div class='alert error' v-if="error">
        Error: {{ error }}
        <i class="icon-cancel" @click="clearError"></i>
      </div>
      <div class="attachments">
        <div class="media-upload-container attachment" v-for="file in newStatus.files">
          <i class="fa icon-cancel" @click="removeMediaFile(file)"></i>
          <img class="thumbnail media-upload" :src="file.image" v-if="type(file) === 'image'"></img>
          <video v-if="type(file) === 'video'" :src="file.image" controls></video>
          <audio v-if="type(file) === 'audio'" :src="file.image" controls></audio>
          <a v-if="type(file) === 'unknown'" :href="file.image">{{file.url}}</a>
        </div>
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

  .attachments {
    padding: 0 0.5em;

    .attachment {
      position: relative;
      border: 1px solid $fallback--border;
      border: 1px solid var(--border, $fallback--border);
      margin: 0.5em 0.8em 0.2em 0;
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
    min-width: 75%;
    background: $fallback--bg;
    background: var(--bg, $fallback--bg);
    color: $fallback--lightFg;
    color: var(--lightFg, $fallback--lightFg);
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
      background-color: $fallback--btn;
      background-color: var(--btn, $fallback--btn);
    }
  }
}
</style>
