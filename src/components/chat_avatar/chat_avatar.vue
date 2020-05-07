<template>
  <router-link
    :to="getUserProfileLink(user) || ''"
  >
    <StillImage
      v-if="user"
      :style="{ 'width': width, 'height': height }"
      class="avatar chat-avatar single-user"
      :alt="user.screen_name"
      :title="user.screen_name"
      :src="user.profile_image_url_original"
      error-src="/images/avi.png"
      :class="{ 'better-shadow': betterShadow }"
    />
    <div
      v-else
      class="avatar chat-avatar single-user"
      :style="{ 'width': width, 'height': height }"
    />
  </router-link>
</template>

<script src="./chat_avatar.js"></script>
<style lang="scss">
@import '../../_variables.scss';

.chat-avatar {
  display: inline-block;
  vertical-align: middle;

  &.single-user {
    border-radius: $fallback--avatarAltRadius;
    border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);
  }

  .avatar.still-image {
    width: 48px;
    height: 48px;

    box-shadow: var(--avatarStatusShadow);
    border-radius: 0;

    &.better-shadow {
      box-shadow: var(--avatarStatusShadowInset);
      filter: var(--avatarStatusShadowFilter)
    }

    &.animated::before {
      display: none;
    }
  }
}
</style>
