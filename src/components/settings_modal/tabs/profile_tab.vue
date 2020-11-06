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
      <div v-if="maxFields > 0">
        <p>{{ $t('settings.profile_fields.label') }}</p>
        <div
          v-for="(_, i) in newFields"
          :key="i"
          class="profile-fields"
        >
          <EmojiInput
            v-model="newFields[i].name"
            enable-emoji-picker
            hide-emoji-button
            :suggest="userSuggestor"
          >
            <input
              v-model="newFields[i].name"
              :placeholder="$t('settings.profile_fields.name')"
            >
          </EmojiInput>
          <EmojiInput
            v-model="newFields[i].value"
            enable-emoji-picker
            hide-emoji-button
            :suggest="userSuggestor"
          >
            <input
              v-model="newFields[i].value"
              :placeholder="$t('settings.profile_fields.value')"
            >
          </EmojiInput>
          <div
            class="icon-container"
          >
            <FAIcon
              v-show="newFields.length > 1"
              icon="times"
              @click="deleteField(i)"
            />
          </div>
        </div>
        <a
          v-if="newFields.length < maxFields"
          class="add-field faint"
          @click="addField"
        >
          <FAIcon icon="plus" />
          {{ $t("settings.profile_fields.add_field") }}
        </a>
      </div>
      <p>
        <Checkbox v-model="bot">
          {{ $t('settings.bot') }}
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
      <div class="current-avatar-container">
        <img
          :src="user.profile_image_url_original"
          class="current-avatar"
        >
        <FAIcon
          v-if="!isDefaultAvatar && pickAvatarBtnVisible"
          :title="$t('settings.reset_avatar')"
          class="reset-button"
          icon="times"
          type="button"
          @click="resetAvatar"
        />
      </div>
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
      <div class="banner-background-preview">
        <img :src="user.cover_photo">
        <FAIcon
          v-if="!isDefaultBanner"
          :title="$t('settings.reset_profile_banner')"
          class="reset-button"
          icon="times"
          type="button"
          @click="resetBanner"
        />
      </div>
      <p>{{ $t('settings.set_new_profile_banner') }}</p>
      <img
        v-if="bannerPreview"
        class="banner-background-preview"
        :src="bannerPreview"
      >
      <div>
        <input
          type="file"
          @change="uploadFile('banner', $event)"
        >
      </div>
      <FAIcon
        v-if="bannerUploading"
        class="uploading"
        spin
        icon="circle-notch"
      />
      <button
        v-else-if="bannerPreview"
        class="btn btn-default"
        @click="submitBanner(banner)"
      >
        {{ $t('general.submit') }}
      </button>
      <div
        v-if="bannerUploadError"
        class="alert error"
      >
        Error: {{ bannerUploadError }}
        <FAIcon
          class="fa-scale-110 fa-old-padding"
          icon="times"
          @click="clearUploadError('banner')"
        />
      </div>
    </div>
    <div class="setting-item">
      <h2>{{ $t('settings.profile_background') }}</h2>
      <div class="banner-background-preview">
        <img :src="user.background_image">
        <FAIcon
          v-if="!isDefaultBackground"
          :title="$t('settings.reset_profile_background')"
          class="reset-button"
          icon="times"
          type="button"
          @click="resetBackground"
        />
      </div>
      <p>{{ $t('settings.set_new_profile_background') }}</p>
      <img
        v-if="backgroundPreview"
        class="banner-background-preview"
        :src="backgroundPreview"
      >
      <div>
        <input
          type="file"
          @change="uploadFile('background', $event)"
        >
      </div>
      <FAIcon
        v-if="backgroundUploading"
        class="uploading"
        spin
        icon="circle-notch"
      />
      <button
        v-else-if="backgroundPreview"
        class="btn btn-default"
        @click="submitBackground(background)"
      >
        {{ $t('general.submit') }}
      </button>
      <div
        v-if="backgroundUploadError"
        class="alert error"
      >
        Error: {{ backgroundUploadError }}
        <FAIcon
          size="lg"
          class="fa-scale-110 fa-old-padding"
          icon="times"
          @click="clearUploadError('background')"
        />
      </div>
    </div>
  </div>
</template>

<script src="./profile_tab.js"></script>
<style lang="scss" src="./profile_tab.scss"></style>
