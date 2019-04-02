<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      <div class="title">
        {{$t('settings.user_settings')}}
      </div>
      <transition name="fade">
        <template v-if="currentSaveStateNotice">
          <div @click.prevent class="alert error" v-if="currentSaveStateNotice.error">
            {{ $t('settings.saving_err') }}
          </div>

          <div @click.prevent class="alert transparent" v-if="!currentSaveStateNotice.error">
            {{ $t('settings.saving_ok') }}
          </div>
        </template>
      </transition>
    </div>
    <div class="panel-body profile-edit">
      <tab-switcher>
        <div :label="$t('settings.profile_tab')">
          <div class="setting-item" >
            <h2>{{$t('settings.name_bio')}}</h2>
            <p>{{$t('settings.name')}}</p>
            <EmojiInput 
              type="text"
              v-model="newName"
              id="username"
              classname="name-changer"
            />
            <p>{{$t('settings.bio')}}</p>
            <EmojiInput
              type="textarea"
              v-model="newBio"
              classname="bio"
            />
            <p>
              <input type="checkbox" v-model="newLocked" id="account-locked">
              <label for="account-locked">{{$t('settings.lock_account_description')}}</label>
            </p>
            <div>
              <label for="default-vis">{{$t('settings.default_vis')}}</label>
              <div id="default-vis" class="visibility-tray">
                <scope-selector
                  :showAll="true"
                  :userDefault="newDefaultScope"
                  :onScopeChange="changeVis"/>
              </div>
            </div>
            <p>
              <input type="checkbox" v-model="newNoRichText" id="account-no-rich-text">
              <label for="account-no-rich-text">{{$t('settings.no_rich_text_description')}}</label>
            </p>
            <p>
              <input type="checkbox" v-model="hideFollows" id="account-hide-follows">
              <label for="account-hide-follows">{{$t('settings.hide_follows_description')}}</label>
            </p>
            <p>
              <input type="checkbox" v-model="hideFollowers" id="account-hide-followers">
              <label for="account-hide-followers">{{$t('settings.hide_followers_description')}}</label>
            </p>
            <p>
              <input type="checkbox" v-model="showRole" id="account-show-role">
              <label for="account-show-role" v-if="role === 'admin'">{{$t('settings.show_admin_badge')}}</label>
              <label for="account-show-role" v-if="role === 'moderator'">{{$t('settings.show_moderator_badge')}}</label>
            </p>
            <button :disabled='newName && newName.length === 0' class="btn btn-default" @click="updateProfile">{{$t('general.submit')}}</button>
          </div>
          <div class="setting-item">
            <h2>{{$t('settings.avatar')}}</h2>
            <p class="visibility-notice">{{$t('settings.avatar_size_instruction')}}</p>
            <p>{{$t('settings.current_avatar')}}</p>
            <img :src="user.profile_image_url_original" class="current-avatar" />
            <p>{{$t('settings.set_new_avatar')}}</p>
            <button class="btn" type="button" id="pick-avatar" v-show="pickAvatarBtnVisible">{{$t('settings.upload_a_photo')}}</button>
            <image-cropper trigger="#pick-avatar" :submitHandler="submitAvatar" @open="pickAvatarBtnVisible=false" @close="pickAvatarBtnVisible=true" />
          </div>
          <div class="setting-item">
            <h2>{{$t('settings.profile_banner')}}</h2>
            <p>{{$t('settings.current_profile_banner')}}</p>
            <img :src="user.cover_photo" class="banner" />
            <p>{{$t('settings.set_new_profile_banner')}}</p>
            <img class="banner" v-bind:src="bannerPreview" v-if="bannerPreview" />
            <div>
              <input type="file" @change="uploadFile('banner', $event)" />
            </div>
            <i class=" icon-spin4 animate-spin uploading" v-if="bannerUploading"></i>
            <button class="btn btn-default" v-else-if="bannerPreview" @click="submitBanner">{{$t('general.submit')}}</button>
            <div class='alert error' v-if="bannerUploadError">
              Error: {{ bannerUploadError }}
              <i class="button-icon icon-cancel" @click="clearUploadError('banner')"></i>
            </div>
          </div>
          <div class="setting-item">
            <h2>{{$t('settings.profile_background')}}</h2>
            <p>{{$t('settings.set_new_profile_background')}}</p>
            <img class="bg" v-bind:src="backgroundPreview" v-if="backgroundPreview" />
            <div>
              <input type="file" @change="uploadFile('background', $event)" />
            </div>
            <i class=" icon-spin4 animate-spin uploading" v-if="backgroundUploading"></i>
            <button class="btn btn-default" v-else-if="backgroundPreview" @click="submitBg">{{$t('general.submit')}}</button>
            <div class='alert error' v-if="backgroundUploadError">
              Error: {{ backgroundUploadError }}
              <i class="button-icon icon-cancel" @click="clearUploadError('background')"></i>
            </div>
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
            <h2>{{$t('settings.oauth_tokens')}}</h2>
            <table class="oauth-tokens">
              <thead>
                <tr>
                  <th>{{$t('settings.app_name')}}</th>
                  <th>{{$t('settings.valid_until')}}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="oauthToken in oauthTokens" :key="oauthToken.id">
                  <td>{{oauthToken.appName}}</td>
                  <td>{{oauthToken.validUntil}}</td>
                  <td class="actions">
                    <button class="btn btn-default" @click="revokeToken(oauthToken.id)">
                      {{$t('settings.revoke_token')}}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
            <form>
              <input type="file" ref="followlist" v-on:change="followListChange" />
            </form>
            <i class=" icon-spin4 animate-spin uploading" v-if="followListUploading"></i>
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

        <div :label="$t('settings.blocks_tab')">
          <block-list :refresh="true">
            <template slot="empty">{{$t('settings.no_blocks')}}</template>
          </block-list>
        </div>

        <div :label="$t('settings.mutes_tab')">
          <mute-list :refresh="true">
            <template slot="empty">{{$t('settings.no_mutes')}}</template>
          </mute-list>
        </div>
      </tab-switcher>
    </div>
  </div>
</template>

<script src="./user_settings.js">
</script>

<style lang="scss">
@import '../../_variables.scss';

.profile-edit {
  .bio {
    margin: 0;
  }

  input[type=file] {
    padding: 5px;
    height: auto;
  }

  .banner {
    max-width: 100%;
  }

  .uploading {
    font-size: 1.5em;
    margin: 0.25em;
  }

  .name-changer {
    width: 100%;
  }

  .bg {
    max-width: 100%;
  }

  .current-avatar {
    display: block;
    width: 150px;
    height: 150px;
    border-radius: $fallback--avatarRadius;
    border-radius: var(--avatarRadius, $fallback--avatarRadius);
  }

  .oauth-tokens {
    width: 100%;

    th {
      text-align: left;
    }

    .actions {
      text-align: right;
    }
  }
}
</style>
