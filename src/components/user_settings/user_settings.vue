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
              v-model="newName"
              enable-emoji-picker
              :suggest="emojiSuggestor"
            >
              <input
                id="username"
                v-model="newName"
                classname="name-changer"
              >
            </EmojiInput>
            <p>{{ $t('settings.bio') }}</p>
            <EmojiInput
              v-model="newBio"
              enable-emoji-picker
              :suggest="emojiUserSuggestor"
            >
              <textarea
                v-model="newBio"
                classname="bio"
              />
            </EmojiInput>
            <p>
              <Checkbox v-model="newLocked">
                {{ $t('settings.lock_account_description') }}
              </Checkbox>
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
                  :initial-scope="newDefaultScope"
                  :on-scope-change="changeVis"
                />
              </div>
            </div>
            <p>
              <Checkbox v-model="newNoRichText">
                {{ $t('settings.no_rich_text_description') }}
              </Checkbox>
            </p>
            <p>
              <Checkbox v-model="hideFollows">
                {{ $t('settings.hide_follows_description') }}
              </Checkbox>
            </p>
            <p class="setting-subitem">
              <Checkbox
                v-model="hideFollowsCount"
                :disabled="!hideFollows"
              >
                {{ $t('settings.hide_follows_count_description') }}
              </Checkbox>
            </p>
            <p>
              <Checkbox v-model="hideFollowers">
                {{ $t('settings.hide_followers_description') }}
              </Checkbox>
            </p>
            <p class="setting-subitem">
              <Checkbox
                v-model="hideFollowersCount"
                :disabled="!hideFollowers"
              >
                {{ $t('settings.hide_followers_count_description') }}
              </Checkbox>
            </p>
            <p>
              <Checkbox v-model="allowFollowingMove">
                {{ $t('settings.allow_following_move') }}
              </Checkbox>
            </p>
            <p v-if="role === 'admin' || role === 'moderator'">
              <Checkbox v-model="showRole">
                <template v-if="role === 'admin'">
                  {{ $t('settings.show_admin_badge') }}
                </template>
                <template v-if="role === 'moderator'">
                  {{ $t('settings.show_moderator_badge') }}
                </template>
              </Checkbox>
            </p>
            <p>
              <Checkbox v-model="discoverable">
                {{ $t('settings.discoverable') }}
              </Checkbox>
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
            <h2>{{ $t('settings.change_email') }}</h2>
            <div>
              <p>{{ $t('settings.new_email') }}</p>
              <input
                v-model="newEmail"
                type="email"
                autocomplete="email"
              >
            </div>
            <div>
              <p>{{ $t('settings.current_password') }}</p>
              <input
                v-model="changeEmailPassword"
                type="password"
                autocomplete="current-password"
              >
            </div>
            <button
              class="btn btn-default"
              @click="changeEmail"
            >
              {{ $t('general.submit') }}
            </button>
            <p v-if="changedEmail">
              {{ $t('settings.changed_email') }}
            </p>
            <template v-if="changeEmailError !== false">
              <p>{{ $t('settings.change_email_error') }}</p>
              <p>{{ changeEmailError }}</p>
            </template>
          </div>

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
          <mfa />
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
          :label="$t('settings.notifications')"
        >
          <div class="setting-item">
            <div class="select-multiple">
              <span class="label">{{ $t('settings.notification_setting') }}</span>
              <ul class="option-list">
                <li>
                  <Checkbox v-model="notificationSettings.follows">
                    {{ $t('settings.notification_setting_follows') }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="notificationSettings.followers">
                    {{ $t('settings.notification_setting_followers') }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="notificationSettings.non_follows">
                    {{ $t('settings.notification_setting_non_follows') }}
                  </Checkbox>
                </li>
                <li>
                  <Checkbox v-model="notificationSettings.non_followers">
                    {{ $t('settings.notification_setting_non_followers') }}
                  </Checkbox>
                </li>
              </ul>
            </div>
            <p>{{ $t('settings.notification_mutes') }}</p>
            <p>{{ $t('settings.notification_blocks') }}</p>
            <button
              class="btn btn-default"
              @click="updateNotificationSettings"
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
            <Importer
              :submit-handler="importFollows"
              :success-message="$t('settings.follows_imported')"
              :error-message="$t('settings.follow_import_error')"
            />
          </div>
          <div class="setting-item">
            <h2>{{ $t('settings.follow_export') }}</h2>
            <Exporter
              :get-content="getFollowsContent"
              filename="friends.csv"
              :export-button-label="$t('settings.follow_export_button')"
            />
          </div>
          <div class="setting-item">
            <h2>{{ $t('settings.block_import') }}</h2>
            <p>{{ $t('settings.import_blocks_from_a_csv_file') }}</p>
            <Importer
              :submit-handler="importBlocks"
              :success-message="$t('settings.blocks_imported')"
              :error-message="$t('settings.block_import_error')"
            />
          </div>
          <div class="setting-item">
            <h2>{{ $t('settings.block_export') }}</h2>
            <Exporter
              :get-content="getBlocksContent"
              filename="blocks.csv"
              :export-button-label="$t('settings.block_export_button')"
            />
          </div>
        </div>

        <div :label="$t('settings.blocks_tab')">
          <div class="profile-edit-usersearch-wrapper">
            <Autosuggest
              :filter="filterUnblockedUsers"
              :query="queryUserIds"
              :placeholder="$t('settings.search_user_to_block')"
            >
              <BlockCard
                slot-scope="row"
                :user-id="row.item"
              />
            </Autosuggest>
          </div>
          <BlockList
            :refresh="true"
            :get-key="identity"
          >
            <template
              slot="header"
              slot-scope="{selected}"
            >
              <div class="profile-edit-bulk-actions">
                <ProgressButton
                  v-if="selected.length > 0"
                  class="btn btn-default"
                  :click="() => blockUsers(selected)"
                >
                  {{ $t('user_card.block') }}
                  <template slot="progress">
                    {{ $t('user_card.block_progress') }}
                  </template>
                </ProgressButton>
                <ProgressButton
                  v-if="selected.length > 0"
                  class="btn btn-default"
                  :click="() => unblockUsers(selected)"
                >
                  {{ $t('user_card.unblock') }}
                  <template slot="progress">
                    {{ $t('user_card.unblock_progress') }}
                  </template>
                </ProgressButton>
              </div>
            </template>
            <template
              slot="item"
              slot-scope="{item}"
            >
              <BlockCard :user-id="item" />
            </template>
            <template slot="empty">
              {{ $t('settings.no_blocks') }}
            </template>
          </BlockList>
        </div>

        <div :label="$t('settings.mutes_tab')">
          <tab-switcher>
            <div label="Users">
              <div class="profile-edit-usersearch-wrapper">
                <Autosuggest
                  :filter="filterUnMutedUsers"
                  :query="queryUserIds"
                  :placeholder="$t('settings.search_user_to_mute')"
                >
                  <MuteCard
                    slot-scope="row"
                    :user-id="row.item"
                  />
                </Autosuggest>
              </div>
              <MuteList
                :refresh="true"
                :get-key="identity"
              >
                <template
                  slot="header"
                  slot-scope="{selected}"
                >
                  <div class="profile-edit-bulk-actions">
                    <ProgressButton
                      v-if="selected.length > 0"
                      class="btn btn-default"
                      :click="() => muteUsers(selected)"
                    >
                      {{ $t('user_card.mute') }}
                      <template slot="progress">
                        {{ $t('user_card.mute_progress') }}
                      </template>
                    </ProgressButton>
                    <ProgressButton
                      v-if="selected.length > 0"
                      class="btn btn-default"
                      :click="() => unmuteUsers(selected)"
                    >
                      {{ $t('user_card.unmute') }}
                      <template slot="progress">
                        {{ $t('user_card.unmute_progress') }}
                      </template>
                    </ProgressButton>
                  </div>
                </template>
                <template
                  slot="item"
                  slot-scope="{item}"
                >
                  <MuteCard :user-id="item" />
                </template>
                <template slot="empty">
                  {{ $t('settings.no_mutes') }}
                </template>
              </MuteList>
            </div>

            <div :label="$t('settings.domain_mutes')">
              <div class="profile-edit-domain-mute-form">
                <input
                  v-model="newDomainToMute"
                  :placeholder="$t('settings.type_domains_to_mute')"
                  type="text"
                  @keyup.enter="muteDomain"
                >
                <ProgressButton
                  class="btn btn-default"
                  :click="muteDomain"
                >
                  {{ $t('domain_mute_card.mute') }}
                  <template slot="progress">
                    {{ $t('domain_mute_card.mute_progress') }}
                  </template>
                </ProgressButton>
              </div>
              <DomainMuteList
                :refresh="true"
                :get-key="identity"
              >
                <template
                  slot="header"
                  slot-scope="{selected}"
                >
                  <div class="profile-edit-bulk-actions">
                    <ProgressButton
                      v-if="selected.length > 0"
                      class="btn btn-default"
                      :click="() => unmuteDomains(selected)"
                    >
                      {{ $t('domain_mute_card.unmute') }}
                      <template slot="progress">
                        {{ $t('domain_mute_card.unmute_progress') }}
                      </template>
                    </ProgressButton>
                  </div>
                </template>
                <template
                  slot="item"
                  slot-scope="{item}"
                >
                  <DomainMuteCard :domain="item" />
                </template>
                <template slot="empty">
                  {{ $t('settings.no_mutes') }}
                </template>
              </DomainMuteList>
            </div>
          </tab-switcher>
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

  &-domain-mute-form {
    padding: 1em;
    display: flex;
    flex-direction: column;

    button {
      align-self: flex-end;
      margin-top: 1em;
      width: 10em;
    }
  }

  .setting-subitem {
    margin-left: 1.75em;
  }
}
</style>
