<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      {{$t('settings.user_settings')}}
    </div>
    <div class="panel-body profile-edit">
      <div class="setting-item">
        <h3>{{$t('settings.name_bio')}}</h3>
        <p>{{$t('settings.name')}}</p>
        <input class='name-changer' id='username' v-model="newname"></input>
        <p>{{$t('settings.bio')}}</p>
        <textarea class="bio" v-model="newbio"></textarea>
        <button :disabled='newname.length <= 0' class="btn btn-default" @click="updateProfile">{{$t('general.submit')}}</button>
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
        <i class="icon-spin4 animate-spin" v-if="uploading[0]"></i>
        <button class="btn btn-default" v-else-if="previews[0]" @click="submitAvatar">{{$t('general.submit')}}</button>
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
        <i class=" icon-spin4 animate-spin uploading" v-if="uploading[1]"></i>
        <button class="btn btn-default" v-else-if="previews[1]" @click="submitBanner">{{$t('general.submit')}}</button>
      </div>
      <div class="setting-item">
        <h3>{{$t('settings.profile_background')}}</h3>
        <p>{{$t('settings.set_new_profile_background')}}</p>
        <img class="bg" v-bind:src="previews[2]" v-if="previews[2]">
        </img>
        <div>
          <input type="file" @change="uploadFile(2, $event)" ></input>
        </div>
        <i class=" icon-spin4 animate-spin uploading" v-if="uploading[2]"></i>
        <button class="btn btn-default" v-else-if="previews[2]" @click="submitBg">{{$t('general.submit')}}</button>
      </div>
      <div class="setting-item" v-if="pleromaBackend">
        <h3>{{$t('settings.follow_import')}}</h3>
        <p>{{$t('settings.import_followers_from_a_csv_file')}}</p>
        <form v-model="followImportForm">
          <input type="file" ref="followlist" v-on:change="followListChange"></input>
        </form>
        <i class=" icon-spin4 animate-spin uploading" v-if="uploading[3]"></i>
        <button class="btn btn-default" v-else @click="importFollows">{{$t('general.submit')}}</button>
        <div v-if="followsImported">
          <i class="icon-cross" @click="dismissImported"></i>
          <p>{{$t('settings.follows_imported')}}</p>
        </div>
        <div v-else-if="followImportError">
          <i class="icon-cross" @click="dismissImported"</i>
          <p>{{$t('settings.follow_import_error')}}</p>
        </div>
      </div>
      <div class="setting-item" v-if="enableFollowsExport">
       <h3>{{$t('settings.follow_export')}}</h3>
       <button class="btn btn-default" @click="exportFollows">{{$t('settings.follow_export_button')}}</button>
     </div>
     <div class="setting-item" v-else>
       <h3>{{$t('settings.follow_export_processing')}}</h3>
       </div>
    </div>
  </div>
</template>

<script src="./user_settings.js">
</script>

<style lang="scss">
.profile-edit {
  .bio {
    margin: 0;
  }

  input[type=file] {
    padding: 5px;
  }

  .banner {
    max-width: 400px;
  }

  .uploading {
    font-size: 1.5em;
    margin: 0.25em;
  }
}
</style>
