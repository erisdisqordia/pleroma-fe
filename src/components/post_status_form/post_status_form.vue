<template>
  <div class="post-status-form">
    <form @submit.prevent="postStatus(newStatus)">
      <div class="form-group" >
        <textarea @click="setCaret" @keyup="setCaret" v-model="newStatus.status" :placeholder="$t('post_status.default')" rows="1" class="form-control" @keydown.down="cycleForward" @keydown.up="cycleBackward" @keydown.shift.tab="cycleBackward" @keydown.tab="cycleForward" @keydown.enter="replaceCandidate" @keydown.meta.enter="postStatus(newStatus)" @keyup.ctrl.enter="postStatus(newStatus)" @drop="fileDrop" @dragover.prevent="fileDrag" @input="resize" @paste="paste"></textarea>
      </div>
      <div style="position:relative;" v-if="candidates">
        <div class="autocomplete-panel">
          <div v-for="candidate in candidates" @click="replace(candidate.utf || (candidate.screen_name + ' '))">
            <div v-if="candidate.highlighted" class="autocomplete">
              <span v-if="candidate.img"><img :src="candidate.img"></span>
              <span v-else>{{candidate.utf}}</span>
              <span>{{candidate.screen_name}}<small>{{candidate.name}}</small></span>
            </div>
            <div v-else class="autocomplete">
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
        <p v-else-if="hasStatusLengthLimit">{{ charactersLeft }}</p>

        <button v-if="posting" disabled class="btn btn-default">{{$t('post_status.posting')}}</button>
        <button v-else-if="isOverLengthLimit" disabled class="btn btn-default">{{$t('general.submit')}}</button>
        <button v-else :disabled="submitDisabled" type="submit" class="btn btn-default">{{$t('general.submit')}}</button>
      </div>
      <div class='error' v-if="error">
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
        border-radius: 50%;
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
        border-radius: 5px;
        text-align: center;
        background-color: rgba(255, 48, 16, 0.65);
        background-color: var(--cRed);
        padding: 0.25em;
        margin: 0.35em;
        display: flex;
    }

    .attachments {
        padding: 0 0.5em;

        .attachment {
            position: relative;
            border: var(--border);
            margin: 0.5em 0.8em 0.2em 0;
        }

        i {
            position: absolute;
            margin: 10px;
            padding: 5px;
            background: rgba(230,230,230,0.6);
            border-radius: 5px;
            font-weight: bold;
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

    form textarea {
        border-radius: 5px;
        line-height:16px;
        padding: 5px;
        resize: none;
        overflow: hidden;
    }

    form textarea:focus {
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
        border-radius: 5px;
        position: absolute;
        z-index: 1;
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
        min-width: 75%;
        background: var(--btn);
        color: var(--lightFg);
    }

    .autocomplete {
        cursor: pointer;
        padding: 0.2em 0.4em 0.2em 0.4em;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        display: flex;
        img {
            width: 24px;
            height: 24px;
            border-radius: 2px;
            object-fit: contain;
        }
        span {
            line-height: 24px;
            margin: 0 0.1em 0 0.2em;
        }
        small {
            margin-left: .5em;
            color: var(--faint);
        }
    }
}

</style>
