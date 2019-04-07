<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      <div class="title">
        {{ $t('settings.user_settings') }}
      </div>
      <transition name="fade">
        <template v-if="currentSaveStateNotice">
          <div
            v-if="currentSaveStateNotice.error"
            class="alert error"
            @click.prevent
          >
            {{ $t('settings.saving_err') }}
          </div>

          <div
            v-if="!currentSaveStateNotice.error"
            class="alert transparent"
            @click.prevent
          >
            {{ $t('settings.saving_ok') }}
          </div>
        </template>
      </transition>
    </div>
    <div class="panel-body profile-edit">
      <tab-switcher>
        <div :label="$t('settings.profile_tab')">
          <div class="setting-item">
            <h2>{{ $t('settings.name_bio') }}</h2>
            <p>{{ $t('settings.name') }}</p>
            <EmojiInput
              id="username"
              v-model="newName"
              type="text"
              classname="name-changer"
            />
            <p>{{ $t('settings.bio') }}</p>
            <EmojiInput
              v-model="newBio"
              type="textarea"
              classname="bio"
            />
            <p>
              <input
                id="account-locked"
                v-model="newLocked"
                type="checkbox"
              >
              <label for="account-locked">{{ $t('settings.lock_account_description') }}</label>
            </p>
            <div>
              <label for="default-vis">{{ $t('settings.default_vis') }}</label>
              <div
                id="default-vis"
                class="visibility-tray"
              >
                <scope-selector
                  :show-all="true"
                  :user-default="newDefaultScope"
                  :on-scope-change="changeVis"
                />
              </div>
            </div>
            <p>
              <input
                id="account-no-rich-text"
                v-model="newNoRichText"
                type="checkbox"
              >
              <label for="account-no-rich-text">{{ $t('settings.no_rich_text_description') }}</label>
            </p>
            <p>
              <input
                id="account-hide-follows"
                v-model="hideFollows"
                type="checkbox"
              >
              <label for="account-hide-follows">{{ $t('settings.hide_follows_description') }}</label>
            </p>
            <p>
              <input
                id="account-hide-followers"
                v-model="hideFollowers"
                type="checkbox"
              >
              <label for="account-hide-followers">{{ $t('settings.hide_followers_description') }}</label>
            </p>
            <p>
              <input
                id="account-show-role"
                v-model="showRole"
                type="checkbox"
              >
              <label
                v-if="role === 'admin'"
                for="account-show-role"
              >{{ $t('settings.show_admin_badge') }}</label>
              <label
                v-if="role === 'moderator'"
                for="account-show-role"
              >{{ $t('settings.show_moderator_badge') }}</label>
            </p>
            <button
              :disabled="newName && newName.length === 0"
              class="btn btn-default"
              @click="updateProfile"
            >
              {{ $t('general.submit') }}
            </button>
          </div>
          <div class="setting-item">
            <h2>{{ $t('settings.avatar') }}</h2>
            <p class="visibility-notice">
              {{ $t('settings.avatar_size_instruction') }}
            </p>
            <p>{{ $t('settings.current_avatar') }}</p>
            <img
              :src="user.profile_image_url_original"
              class="current-avatar"
            >
            <p>{{ $t('settings.set_new_avatar') }}</p>
            <button
              v-show="pickAvatarBtnVisible"
              id="pick-avatar"
              class="btn"
              type="button"
            >
              {{ $t('settings.upload_a_photo') }}
            </button>
            <image-cropper
              trigger="#pick-avatar"
              :submit-handler="submitAvatar"
              @open="pickAvatarBtnVisible=false"
              @close="pickAvatarBtnVisible=true"
            />
          </div>
          <div class="setting-item">
            <h2>{{ $t('settings.profile_banner') }}</h2>
            <p>{{ $t('settings.current_profile_banner') }}</p>
            <img
              :src="user.cover_photo"
              class="banner"
            >
            <p>{{ $t('settings.set_new_profile_banner') }}</p>
            <img
              v-if="bannerPreview"
              class="banner"
              :src="bannerPreview"
            >
            <div>
              <input
                type="file"
                @change="uploadFile('banner', $event)"
              >
            </div>
            <i
              v-if="bannerUploading"
              class=" icon-spin4 animate-spin uploading"
            />
            <button
              v-else-if="bannerPreview"
              class="btn btn-default"
              @click="submitBanner"
            >
              {{ $t('general.submit') }}
            </button>
            <div
              v-if="bannerUploadError"
              class="alert error"
            >
              Error: {{ bannerUploadError }}
              <i
                class="button-icon icon-cancel"
                @click="clearUploadError('banner')"
              />
            </div>
          </div>
          <div class="setting-item">
            <h2>{{ $t('settings.profile_background') }}</h2>
            <p>{{ $t('settings.set_new_profile_background') }}</p>
            <img
              v-if="backgroundPreview"
              class="bg"
              :src="backgroundPreview"
            >
            <div>
              <input
                type="file"
                @change="uploadFile('background', $event)"
              >
            </div>
            <i
              v-if="backgroundUploading"
              class=" icon-spin4 animate-spin uploading"
            />
            <button
              v-else-if="backgroundPreview"
              class="btn btn-default"
              @click="submitBg"
            >
              {{ $t('general.submit') }}
            </button>
            <div
              v-if="backgroundUploadError"
              class="alert error"
            >
              Error: {{ backgroundUploadError }}
              <i
                class="button-icon icon-cancel"
                @click="clearUploadError('background')"
              />
            </div>
          </div>
        </div>

        <div :label="$t('settings.security_tab')">
          <div class="setting-item">
            <h2>{{ $t('settings.change_password') }}</h2>
            <div>
              <p>{{ $t('settings.current_password') }}</p>
              <input
                v-model="changePasswordInputs[0]"
                type="password"
              >
            </div>
            <div>
              <p>{{ $t('settings.new_password') }}</p>
              <input
                v-model="changePasswordInputs[1]"
                type="password"
              >
            </div>
            <div>
              <p>{{ $t('settings.confirm_new_password') }}</p>
              <input
                v-model="changePasswordInputs[2]"
                type="password"
              >
            </div>
            <button
              class="btn btn-default"
              @click="changePassword"
            >
              {{ $t('general.submit') }}
            </button>
            <p v-if="changedPassword">
              {{ $t('settings.changed_password') }}
            </p>
            <p v-else-if="changePasswordError !== false">
              {{ $t('settings.change_password_error') }}
            </p>
            <p v-if="changePasswordError">
              {{ changePasswordError }}
            </p>
          </div>

          <div class="setting-item">
            <h2>{{ $t('settings.oauth_tokens') }}</h2>
            <table class="oauth-tokens">
              <thead>
                <tr>
                  <th>{{ $t('settings.app_name') }}</th>
                  <th>{{ $t('settings.valid_until') }}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="oauthToken in oauthTokens"
                  :key="oauthToken.id"
                >
                  <td>{{ oauthToken.appName }}</td>
                  <td>{{ oauthToken.validUntil }}</td>
                  <td class="actions">
                    <button
                      class="btn btn-default"
                      @click="revokeToken(oauthToken.id)"
                    >
                      {{ $t('settings.revoke_token') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="setting-item">
            <h2>{{ $t('settings.delete_account') }}</h2>
            <p v-if="!deletingAccount">
              {{ $t('settings.delete_account_description') }}
            </p>
            <div v-if="deletingAccount">
              <p>{{ $t('settings.delete_account_instructions') }}</p>
              <p>{{ $t('login.password') }}</p>
              <input
                v-model="deleteAccountConfirmPasswordInput"
                type="password"
              >
              <button
                class="btn btn-default"
                @click="deleteAccount"
              >
                {{ $t('settings.delete_account') }}
              </button>
            </div>
            <p v-if="deleteAccountError !== false">
              {{ $t('settings.delete_account_error') }}
            </p>
            <p v-if="deleteAccountError">
              {{ deleteAccountError }}
            </p>
            <button
              v-if="!deletingAccount"
              class="btn btn-default"
              @click="confirmDelete"
            >
              {{ $t('general.submit') }}
            </button>
          </div>
        </div>

        <div
          v-if="pleromaBackend"
          :label="$t('settings.data_import_export_tab')"
        >
          <div class="setting-item">
            <h2>{{ $t('settings.follow_import') }}</h2>
            <p>{{ $t('settings.import_followers_from_a_csv_file') }}</p>
            <form>
              <input
                ref="followlist"
                type="file"
                @change="followListChange"
              >
            </form>
            <i
              v-if="followListUploading"
              class=" icon-spin4 animate-spin uploading"
            />
            <button
              v-else
              class="btn btn-default"
              @click="importFollows"
            >
              {{ $t('general.submit') }}
            </button>
            <div v-if="followsImported">
              <i
                class="icon-cross"
                @click="dismissImported"
              />
              <p>{{ $t('settings.follows_imported') }}</p>
            </div>
            <div v-else-if="followImportError">
              <i
                class="icon-cross"
                @click="dismissImported"
              />
              <p>{{ $t('settings.follow_import_error') }}</p>
            </div>
          </div>
          <div
            v-if="enableFollowsExport"
            class="setting-item"
          >
            <h2>{{ $t('settings.follow_export') }}</h2>
            <button
              class="btn btn-default"
              @click="exportFollows"
            >
              {{ $t('settings.follow_export_button') }}
            </button>
          </div>
          <div
            v-else
            class="setting-item"
          >
            <h2>{{ $t('settings.follow_export_processing') }}</h2>
          </div>
        </div>

        <div :label="$t('settings.blocks_tab')">
          <block-list :refresh="true">
            <template slot="empty">
              {{ $t('settings.no_blocks') }}
            </template>
          </block-list>
        </div>

        <div :label="$t('settings.mutes_tab')">
          <mute-list :refresh="true">
            <template slot="empty">
              {{ $t('settings.no_mutes') }}
            </template>
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
