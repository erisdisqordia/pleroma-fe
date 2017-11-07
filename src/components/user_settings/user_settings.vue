<template>
  <div class="settings panel panel-default base00-background">
    <div class="panel-heading base01-background base04">
      {{$t('settings.user_settings')}}
    </div>
    <div class="panel-body profile-edit">
      <div class="setting-item">
        <h3>{{$t('settings.name_bio')}}</h3>
        <p>{{$t('settings.name')}}</p>
        <input class='name-changer base03-border' id='username' v-model="newname" :value="user.screen_name"></input>
        <p>{{$t('settings.bio')}}</p>
        <textarea class="bio base03-border" v-model="newbio"></textarea>
        <button :disabled='newname.length <= 0' class="btn btn-default base05 base01-background" @click="updateProfile">{{$t('general.submit')}}</button>
      </div>
      <div class="setting-item">
        <h3>{{$t('settings.avatar')}}</h3>
        <p>{{$t('settings.current_avatar')}}</p>
        <img :src="user.profile_image_url_original" class="old-avatar"></img>
        <p>{{$t('settings.set_new_avatar')}}</p>
        <img class="new-avatar" v-bind:src="previews[0]" v-if="previews[0]">
        </img>
        <div>
          <input type="file" @change="uploadFile(0, $event)" ></input>
        </div>
        <i class="fa icon-spin4 animate-spin" v-if="uploading[0]"></i>
        <button class="btn btn-default base05 base01-background" v-else-if="previews[0]" @click="submitAvatar">{{$t('general.submit')}}</button>
      </div>
      <div class="setting-item">
        <h3>{{$t('settings.profile_banner')}}</h3>
        <p>{{$t('settings.current_profile_banner')}}</p>
        <img :src="user.cover_photo" class="banner"></img>
        <p>{{$t('settings.set_new_profile_banner')}}</p>
        <img class="banner" v-bind:src="previews[1]" v-if="previews[1]">
        </img>
        <div>
          <input type="file" @change="uploadFile(1, $event)" ></input>
        </div>
        <i class="fa icon-spin4 animate-spin uploading" v-if="uploading[1]"></i>
        <button class="btn btn-default base05 base01-background" v-else-if="previews[1]" @click="submitBanner">{{$t('general.submit')}}</button>
      </div>
      <div class="setting-item">
        <h3>{{$t('settings.profile_background')}}</h3>
        <p>{{$t('settings.set_new_profile_background')}}</p>
        <img class="bg" v-bind:src="previews[2]" v-if="previews[2]">
        </img>
        <div>
          <input type="file" @change="uploadFile(2, $event)" ></input>
        </div>
        <i class="fa icon-spin4 animate-spin uploading" v-if="uploading[2]"></i>
        <button class="btn btn-default base05 base01-background" v-else-if="previews[2]" @click="submitBg">{{$t('general.submit')}}</button>
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
