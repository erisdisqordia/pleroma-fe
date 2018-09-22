<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      {{$t('settings.user_settings')}}
    </div>
    <div class="panel-body profile-edit">
      <tab-switcher>
        <div :label="$t('settings.profile_tab')">
          <div class="setting-item" >
            <h2>{{$t('settings.name_bio')}}</h2>
            <p>{{$t('settings.name')}}</p>
            <input class='name-changer' id='username' v-model="newname"></input>
            <p>{{$t('settings.bio')}}</p>
            <textarea class="bio" v-model="newbio"></textarea>
            <p>
              <input type="checkbox" v-model="newlocked" id="account-locked">
              <label for="account-locked">{{$t('settings.lock_account_description')}}</label>
            </p>
            <div v-if="scopeOptionsEnabled">
              <label for="default-vis">{{$t('settings.default_vis')}}</label>
              <div id="default-vis" class="visibility-tray">
                <i v-on:click="changeVis('direct')" class="icon-mail-alt" :class="vis.direct"></i>
                <i v-on:click="changeVis('private')" class="icon-lock" :class="vis.private"></i>
                <i v-on:click="changeVis('unlisted')" class="icon-lock-open-alt" :class="vis.unlisted"></i>
                <i v-on:click="changeVis('public')" class="icon-globe" :class="vis.public"></i>
              </div>
            </div>
            <p>
              <input type="checkbox" v-model="newnorichtext" id="account-no-rich-text">
              <label for="account-no-rich-text">{{$t('settings.no_rich_text_description')}}</label>
            </p>
            <button :disabled='newname.length <= 0' class="btn btn-default" @click="updateProfile">{{$t('general.submit')}}</button>
          </div>
          <div class="setting-item">
            <h2>{{$t('settings.avatar')}}</h2>
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
            <h2>{{$t('settings.profile_banner')}}</h2>
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
            <h2>{{$t('settings.profile_background')}}</h2>
            <p>{{$t('settings.set_new_profile_background')}}</p>
            <img class="bg" v-bind:src="previews[2]" v-if="previews[2]">
            </img>
            <div>
              <input type="file" @change="uploadFile(2, $event)" ></input>
            </div>
            <i class=" icon-spin4 animate-spin uploading" v-if="uploading[2]"></i>
            <button class="btn btn-default" v-else-if="previews[2]" @click="submitBg">{{$t('general.submit')}}</button>
          </div>
        </div>

        <div :label="$t('settings.security_tab')">
          <div class="setting-item">
            <h2>{{$t('settings.change_password')}}</h2>
            <div>
              <p>{{$t('settings.current_password')}}</p>
              <input type="password" v-model="changePasswordInputs[0]">
            </div>
            <div>
              <p>{{$t('settings.new_password')}}</p>
              <input type="password" v-model="changePasswordInputs[1]">
            </div>
            <div>
              <p>{{$t('settings.confirm_new_password')}}</p>
              <input type="password" v-model="changePasswordInputs[2]">
            </div>
            <button class="btn btn-default" @click="changePassword">{{$t('general.submit')}}</button>
            <p v-if="changedPassword">{{$t('settings.changed_password')}}</p>
            <p v-else-if="changePasswordError !== false">{{$t('settings.change_password_error')}}</p>
            <p v-if="changePasswordError">{{changePasswordError}}</p>
          </div>

          <div class="setting-item">
            <h2>{{$t('settings.delete_account')}}</h2>
            <p v-if="!deletingAccount">{{$t('settings.delete_account_description')}}</p>
            <div v-if="deletingAccount">
              <p>{{$t('settings.delete_account_instructions')}}</p>
              <p>{{$t('login.password')}}</p>
              <input type="password" v-model="deleteAccountConfirmPasswordInput">
              <button class="btn btn-default" @click="deleteAccount">{{$t('settings.delete_account')}}</button>
            </div>
            <p v-if="deleteAccountError !== false">{{$t('settings.delete_account_error')}}</p>
            <p v-if="deleteAccountError">{{deleteAccountError}}</p>
            <button class="btn btn-default" v-if="!deletingAccount" @click="confirmDelete">{{$t('general.submit')}}</button>
          </div>
        </div>

        <div :label="$t('settings.data_import_export_tab')" v-if="pleromaBackend">
          <div class="setting-item">
            <h2>{{$t('settings.follow_import')}}</h2>
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
              <i class="icon-cross" @click="dismissImported"></i>
              <p>{{$t('settings.follow_import_error')}}</p>
            </div>
          </div>
          <div class="setting-item" v-if="enableFollowsExport">
            <h2>{{$t('settings.follow_export')}}</h2>
            <button class="btn btn-default" @click="exportFollows">{{$t('settings.follow_export_button')}}</button>
          </div>
          <div class="setting-item" v-else>
            <h2>{{$t('settings.follow_export_processing')}}</h2>
          </div>
        </div>
      </tab-switcher>
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
    height: auto;
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
