<template>
  <div class="post-status-form">
    <form @submit.prevent="postStatus(newStatus)">
      <div class="form-group" >
        <textarea v-model="newStatus.status" placeholder="Just landed in L.A." rows="3" class="form-control"  @keyup.ctrl.enter="postStatus(newStatus)"></textarea>
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
      <div class='form-bottom'>
        <media-upload @uploading="disableSubmit" @uploaded="addMediaFile" @upload-failed="enableSubmit"></media-upload>
        <button :disabled="submitDisabled" type="submit" class="btn btn-default">Submit</button>
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

         button {
             flex: 2;
         }
     }

     .attachments {
         padding: 0.5em;

         i {
            position: absolute;
            margin: 10px;
            padding: 5px;
            background: rgba(230,230,230,0.6);
            border-radius: 0.5em;
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
         border: none;
         border-radius: 2px;
         line-height:16px;
         padding: 0.5em;
         resize: vertical;
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
