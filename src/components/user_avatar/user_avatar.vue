<template>
  <StillImage class="avatar" :src="imgSrc" :imageLoadError="imageLoadError"/>
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
  overflow: hidden;
  position: relative;

  &.better-shadow {
    box-shadow: var(--avatarStatusShadowInset);
    filter: var(--avatarStatusShadowFilter)
  }

  &.animated::before {
    display: none;
  }

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
