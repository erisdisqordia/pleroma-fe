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

        <div :label="$t('settings.notifications')" v-if="pleromaBackend">
          <div class="setting-item">
            <div class="select-multiple">
              <span class="label">{{$t('settings.notification_setting')}}</span>
              <ul class="option-list">
                <li>
                  <input type="checkbox" id="notification-setting-follows" v-model="notificationSettings.follows">
                  <label for="notification-setting-follows">
                  {{$t('settings.notification_setting_follows')}}
                  </label>
                </li>
                <li>
                  <input type="checkbox" id="notification-setting-followers" v-model="notificationSettings.followers">
                  <label for="notification-setting-followers">
                  {{$t('settings.notification_setting_followers')}}
                  </label>
                </li>
                <li>
                  <input type="checkbox" id="notification-setting-non-follows" v-model="notificationSettings.non_follows">
                  <label for="notification-setting-non-follows">
                  {{$t('settings.notification_setting_non_follows')}}
                  </label>
                </li>
                <li>
                  <input type="checkbox" id="notification-setting-non-followers" v-model="notificationSettings.non_followers">
                  <label for="notification-setting-non-followers">
                  {{$t('settings.notification_setting_non_followers')}}
                  </label>
                </li>
              </ul>
            </div>
            <p>{{$t('settings.notification_mutes')}}</p>
            <p>{{$t('settings.notification_blocks')}}</p>
            <button class="btn btn-default" @click="updateNotificationSettings">{{$t('general.submit')}}</button>
          </div>
        </div>

        <div :label="$t('settings.data_import_export_tab')" v-if="pleromaBackend">
          <div class="setting-item">
            <h2>{{$t('settings.follow_import')}}</h2>
            <p>{{$t('settings.import_followers_from_a_csv_file')}}</p>
            <Importer :submitHandler="importFollows" :successMessage="$t('settings.follows_imported')" :errorMessage="$t('settings.follow_import_error')" />
          </div>
          <div class="setting-item">
            <h2>{{$t('settings.follow_export')}}</h2>
            <Exporter :getContent="getFollowsContent" filename="friends.csv" :exportButtonLabel="$t('settings.follow_export_button')" />
          </div>
          <div class="setting-item">
            <h2>{{$t('settings.block_import')}}</h2>
            <p>{{$t('settings.import_blocks_from_a_csv_file')}}</p>
            <Importer :submitHandler="importBlocks" :successMessage="$t('settings.blocks_imported')" :errorMessage="$t('settings.block_import_error')" />
          </div>
          <div class="setting-item">
            <h2>{{$t('settings.block_export')}}</h2>
            <Exporter :getContent="getBlocksContent" filename="blocks.csv" :exportButtonLabel="$t('settings.block_export_button')" />
          </div>
        </div>

        <div :label="$t('settings.blocks_tab')">
          <div class="profile-edit-usersearch-wrapper">
            <Autosuggest :filter="filterUnblockedUsers" :query="queryUserIds" :placeholder="$t('settings.search_user_to_block')">
              <BlockCard slot-scope="row" :userId="row.item"/>
            </Autosuggest>
          </div>
          <BlockList :refresh="true" :getKey="identity">
            <template slot="header" slot-scope="{selected}">
              <div class="profile-edit-bulk-actions">
                <ProgressButton class="btn btn-default" v-if="selected.length > 0" :click="() => blockUsers(selected)">
                  {{ $t('user_card.block') }}
                  <template slot="progress">{{ $t('user_card.block_progress') }}</template>
                </ProgressButton>
                <ProgressButton class="btn btn-default" v-if="selected.length > 0" :click="() => unblockUsers(selected)">
                  {{ $t('user_card.unblock') }}
                  <template slot="progress">{{ $t('user_card.unblock_progress') }}</template>
                </ProgressButton>
              </div>
            </template>
            <template slot="item" slot-scope="{item}"><BlockCard :userId="item" /></template>
            <template slot="empty">{{$t('settings.no_blocks')}}</template>
          </BlockList>
        </div>

        <div :label="$t('settings.mutes_tab')">
          <div class="profile-edit-usersearch-wrapper">
            <Autosuggest :filter="filterUnMutedUsers" :query="queryUserIds" :placeholder="$t('settings.search_user_to_mute')">
              <MuteCard slot-scope="row" :userId="row.item"/>
            </Autosuggest>
          </div>
          <MuteList :refresh="true" :getKey="identity">
            <template slot="header" slot-scope="{selected}">
              <div class="profile-edit-bulk-actions">
                <ProgressButton class="btn btn-default" v-if="selected.length > 0" :click="() => muteUsers(selected)">
                  {{ $t('user_card.mute') }}
                  <template slot="progress">{{ $t('user_card.mute_progress') }}</template>
                </ProgressButton>
                <ProgressButton class="btn btn-default" v-if="selected.length > 0" :click="() => unmuteUsers(selected)">
                  {{ $t('user_card.unmute') }}
                  <template slot="progress">{{ $t('user_card.unmute_progress') }}</template>
                </ProgressButton>
              </div>
            </template>
            <template slot="item" slot-scope="{item}"><MuteCard :userId="item" /></template>
            <template slot="empty">{{$t('settings.no_mutes')}}</template>
          </MuteList>
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

  .visibility-tray {
    padding-top: 5px;
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

  &-usersearch-wrapper {
    padding: 1em;
  }

  &-bulk-actions {
    text-align: right;
    padding: 0 1em;
    min-height: 28px;

    button {
      width: 10em;
    }
  }
}
</style>
