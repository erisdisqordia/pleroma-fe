<template>
  <div class="post-status-form">
    <form @submit.prevent="postStatus(newStatus)">
      <div class="form-group" >
        <textarea v-model="newStatus.status" placeholder="Just landed in L.A." rows="3" class="form-control"></textarea>
      </div>
      <div class="attachments">
        <div class="attachment" v-for="file in newStatus.files">
          <img class="thumbnail media-upload" :src="file.image"></img>
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
     }

     form {
         display: flex;
         flex-direction: column;
         padding: 0.5em;
     }

     .form-group {
         display: flex;
         flex-direction: column;
         padding: 0.5em;
     }

     .btn {
         cursor: pointer;
     }

     .btn[disabled] {
         cursor: not-allowed;
     }
 }

</style>
