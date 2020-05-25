<template>
  <div class="profile-tab">
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
</template>

<script src="./profile_tab.js"></script>
<style lang="scss" src="./profile_tab.scss"></style>
