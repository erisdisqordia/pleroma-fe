<template>
  <div
    class="still-image"
    :class="{ animated: animated }"
  >
    <canvas
      v-if="animated"
      ref="canvas"
    />
    <!-- NOTE: key is required to force to re-render img tag when src is changed -->
    <img
      ref="src"
      :key="src"
      :alt="alt"
      :title="alt"
      :src="src"
      :referrerpolicy="referrerpolicy"
      @load="onLoad"
      @error="onError"
    >
  </div>
</template>

<script src="./still-image.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.still-image {
  position: relative;
  line-height: 0;
  overflow: hidden;
  display: flex;
  align-items: center;

  canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    visibility: var(--still-image-canvas, visible);
  }

  img {
    width: 100%;
    min-height: 100%;
    object-fit: contain;
  }

  &.animated {
    &::before {
      content: 'gif';
      position: absolute;
      line-height: 10px;
      font-size: 10px;
      top: 5px;
      left: 5px;
      background: rgba(127, 127, 127, 0.5);
      color: #fff;
      display: block;
      padding: 2px 4px;
      border-radius: $fallback--tooltipRadius;
      border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
      z-index: 2;
      visibility: var(--still-image-label-visibility, visible);
    }

    &:hover canvas {
      display: none;
    }

    &:hover::before,
    img {
      visibility: var(--still-image-img, hidden);
    }

    &:hover img {
      visibility: visible;
    }
  }
}
</style>
