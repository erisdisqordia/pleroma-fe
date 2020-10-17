<template>
  <StillImage
    v-if="user"
    class="Avatar"
    :alt="user.screen_name"
    :title="user.screen_name"
    :src="imgSrc(user.profile_image_url_original)"
    :class="{ 'avatar-compact': compact, 'better-shadow': betterShadow }"
    :image-load-error="imageLoadError"
  />
  <div
    v-else
    class="Avatar -placeholder"
    :class="{ 'avatar-compact': compact }"
  />
</template>

<script src="./user_avatar.js"></script>
<style lang="scss">
@import '../../_variables.scss';

.Avatar {
  --still-image-label-visibility: hidden;

  width: 48px;
  height: 48px;
  box-shadow: var(--avatarStatusShadow);
  border-radius: $fallback--avatarRadius;
  border-radius: var(--avatarRadius, $fallback--avatarRadius);

  img {
    width: 100%;
    height: 100%;
  }

  &.better-shadow {
    box-shadow: var(--avatarStatusShadowInset);
    filter: var(--avatarStatusShadowFilter)
  }

  &.animated::before {
    display: none;
  }

  &.avatar-compact {
    width: 32px;
    height: 32px;
    border-radius: $fallback--avatarAltRadius;
    border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);
  }

  &.-placeholder {
    background-color: $fallback--fg;
    background-color: var(--fg, $fallback--fg);
  }
}
</style>
