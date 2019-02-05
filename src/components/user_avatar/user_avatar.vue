<template>
  <StillImage
    class="avatar"
    :class="{ 'avatar-compact': compact, 'better-shadow': betterShadow }"
    :src="imgSrc"
    :imageLoadError="imageLoadError"
  />
</template>

<script src="./user_avatar.js"></script>
<style lang="scss">
@import '../../_variables.scss';

.avatar.still-image {
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
}
</style>
