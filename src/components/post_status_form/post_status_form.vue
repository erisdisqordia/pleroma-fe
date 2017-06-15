<template>
  <div class="post-status-form">
    <form @submit.prevent="postStatus(newStatus)">
      <div class="form-group base03-border" >
        <textarea @click="setCaret" @keyup="setCaret" v-model="newStatus.status" placeholder="Just landed in L.A." rows="1" class="form-control" @keydown.meta.enter="postStatus(newStatus)" @keyup.ctrl.enter="postStatus(newStatus)" @drop="fileDrop" @dragover.prevent="fileDrag" @input="resize"></textarea>
      </div>
      <div>
        <h1>Word</h1>
        <h2>{{textAtCaret}}</h2>
        <h1>Candidates</h1>

        <h3 v-for="candidate in candidates" @click="replace('@' + candidate)">{{candidate}}</h3>
      </div>
      <div class='form-bottom'>
        <media-upload @uploading="disableSubmit" @uploaded="addMediaFile" @upload-failed="enableSubmit" :drop-files="dropFiles"></media-upload>
        <button :disabled="submitDisabled" type="submit" class="btn btn-default base05 base01-background">Submit</button>
      </div>
      <div class="attachments">
        <div class="attachment" v-for="file in newStatus.files">
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
     }

     .attachments {
         padding: 0 0.5em;

         .attachment {
           position: relative;
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
         border: solid;
         border-width: 1px;
         border-color: inherit;
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
     }
 }

</style>
