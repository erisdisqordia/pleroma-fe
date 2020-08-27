<template>
  <div
    ref="galleryContainer"
    style="width: 100%;"
  >
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="gallery-row"
      :style="rowStyle(row.length)"
      :class="{ 'contain-fit': useContainFit, 'cover-fit': !useContainFit }"
    >
      <div class="gallery-row-inner">
        <attachment
          v-for="attachment in row"
          :key="attachment.id"
          :set-media="setMedia"
          :nsfw="nsfw"
          :attachment="attachment"
          :allow-play="false"
          :natural-size-load="onNaturalSizeLoad.bind(null, attachment.id)"
          :style="itemStyle(attachment.id, row)"
        />
      </div>
    </div>
  </div>
</template>

<script src='./gallery.js'></script>

<style lang="scss">
@import '../../_variables.scss';

.gallery-row {
  position: relative;
  height: 0;
  width: 100%;
  flex-grow: 1;
  margin-top: 0.5em;

  .gallery-row-inner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: stretch;
  }

  .gallery-row-inner .attachment {
    margin: 0 0.5em 0 0;
    flex-grow: 1;
    height: 100%;
    box-sizing: border-box;
    // to make failed images a bit more noticeable on chromium
    min-width: 2em;
    &:last-child {
      margin: 0;
    }
  }

  .image-attachment {
    width: 100%;
    height: 100%;
  }

  .video-container {
    height: 100%;
  }

  &.contain-fit {
    img,
    video,
    canvas {
      object-fit: contain;
      height: 100%;
    }
  }

  &.cover-fit {
    img,
    video,
    canvas {
      object-fit: cover;
    }
  }
}

</style>
