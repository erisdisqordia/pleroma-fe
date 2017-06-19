<template>
  <div class="settings panel panel-default base00-background">
    <div class="panel-heading base01-background base04">
      Settings
    </div>
    <div class="panel-body">
      <div class="setting-item">
        <h2>Theme</h2>
        <style-switcher></style-switcher>
      </div>
      <div class="setting-item" v-if="user">
        <h2>Avatar</h2>
        <p>Your current avatar:</p>
        <img :src="user.profile_image_url_original" class="old-avatar"></img>
        <p>Set new avatar:</p>
        <img class="new-avatar" v-bind:src="previewfile">
        </img>
        <div>
          <input name="avatar-upload" id="avatar-upload" type="file" @change="uploadAvatar" ></input>
        </div>
        <button class="btn btn-default base05 base01-background" v-if="previewfile" @click="submitAvatar">Submit</button>
      </div>
      <div class="setting-item">
        <h2>Filtering</h2>
        <p>All notices containing these words will be muted, one per line</p>
        <textarea id="muteWords" v-model="muteWordsString"></textarea>
      </div>
      <div class="setting-item">
        <h2>Attachments</h2>
        <ul class="setting-list">
            <li>
                <input type="checkbox" id="hideAttachments" v-model="hideAttachmentsLocal">
                <label for="hideAttachments">Hide attachments in timeline</label>
            </li>
            <li>
                <input type="checkbox" id="hideAttachmentsInConv" v-model="hideAttachmentsInConvLocal">
                <label for="hideAttachmentsInConv">Hide attachments in conversations</label>
            </li>
            <li>
                <input type="checkbox" id="hideNsfw" v-model="hideNsfwLocal">
                <label for="hideNsfw">Enable clickthrough NSFW attachment hiding</label>
            </li>
            <li>
                <input type="checkbox" id="autoLoad" v-model="autoLoadLocal">
                <label for="autoLoad">Enable automatic loading when scrolled to the bottom</label>
            </li>
            <li>
                <input type="checkbox" id="hoverPreview" v-model="hoverPreviewLocal">
                <label for="hoverPreview">Enable reply-link preview on mouse hover</label>
            </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script src="./settings.js">
</script>

<style lang="scss">
 .setting-item {
   margin: 1em 1em 1.4em;
   textarea {
     width: 100%;
     height: 100px;
   }

   .old-avatar {
     width: 128px;
     border-radius: 5px;
   }

   .new-avatar {
     max-width: 100%;
     border-radius: 5px;
   }

   .btn {
     margin-top: 1em;
     min-height: 28px;
     width: 10em;
   }

   .cropper {
     //position: absolute;
     cursor: move;
     width: 128px;
     height: 128px;
     border:1px solid #fff;
     background-color: #000000;
     .sub {
       width: 100%;
       height: 100%;
       margin: -1px -1px -1px -1px ;
       border:1px dashed #000;
     }
   }
 }
 .setting-list {
   list-style-type: none;
 }
</style>
