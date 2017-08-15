<template>
  <div class="settings panel panel-default base00-background">
    <div class="panel-heading base01-background base04">
      User Settings
    </div>
    <div class="panel-body profile-edit">
      <div class="setting-item">
        <h3>Name & Bio</h3>
        <p>Name</p>
        <input class='name-changer base03-border' id='username' v-model="newname" :value="user.screen_name"></input>
        <p>Bio</p>
        <textarea class="bio base03-border" v-model="newbio"></textarea>
        <button :disabled='newname.length <= 0' class="btn btn-default base05 base01-background" @click="updateProfile">Submit</button>
      </div>
      <div class="setting-item">
        <h3>Avatar</h3>
        <p>Your current avatar:</p>
        <img :src="user.profile_image_url_original" class="old-avatar"></img>
        <p>Set new avatar:</p>
        <img class="new-avatar" v-bind:src="previewavatar" v-if="previewavatar">
        </img>
        <div>
          <input type="file" @change="uploadAvatar" ></input>
        </div>
        <i class="fa icon-spin4 animate-spin" v-if="uploadingavatar"></i>
        <button class="btn btn-default base05 base01-background" v-else-if="previewavatar" @click="submitAvatar">Submit</button>
      </div>
      <div class="setting-item">
        <h3>Profile Banner</h3>
        <p>Your current profile banner:</p>
        <img :src="user.cover_photo" class="banner"></img>
        <p>Set new profile banner:</p>
        <img class="banner" v-bind:src="previewbanner" v-if="previewbanner">
        </img>
        <div>
          <input type="file" @change="uploadBanner" ></input>
        </div>
        <i class="fa icon-spin4 animate-spin uploading" v-if="uploadingbanner"></i>
        <button class="btn btn-default base05 base01-background" v-else-if="previewbanner" @click="submitBanner">Submit</button>
      </div>
      <div class="setting-item">
        <h3>Profile Background</h3>
        <p>Set new profile background:</p>
        <img class="bg" v-bind:src="previewbg" v-if="previewbg">
        </img>
        <div>
          <input type="file" @change="uploadBg" ></input>
        </div>
        <i class="fa icon-spin4 animate-spin uploading" v-if="uploadingbg"></i>
        <button class="btn btn-default base05 base01-background" v-else-if="previewbg" @click="submitBg">Submit</button>
      </div>
    </div>
  </div>
</template>

<script src="./user_settings.js">
</script>

<style lang="scss">
.profile-edit {
  .name-changer {
    border-width: 1px;
    border-style: solid;
    border-radius: 5px;
    padding: 0.2em 0.2em 0.2em 0.2em;
  }
  .name-submit {
    padding: 0.2em 0.5em 0.2em 0.5em;
  }
  .bio {
    border-width: 1px;
    border-style: solid;
    border-radius: 5px;
    margin: 0;
  }
  .banner {
    max-width: 400px;
    border-radius: 5px;
  }

  .uploading {
    font-size: 1.5em;
    margin: 0.25em;
  }
}
</style>
