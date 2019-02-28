<template>
  <div ref="galleryContainer" style="width: 100%;">
    <div class="gallery-row" v-for="row in rows" :style="rowHeight(row.length)" :class="{ 'contain-fit': useContainFit, 'cover-fit': !useContainFit }">
      <attachment
        v-for="attachment in row"
        :setMedia="setMedia"
        :nsfw="nsfw"
        :attachment="attachment"
        :allowPlay="false"
        :key="attachment.id"
      />
    </div>
  </div>
</template>

<script src='./gallery.js'></script>

<style lang="scss">
@import '../../_variables.scss';

.gallery-row {
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: stretch;
  flex-grow: 1;
  margin-top: 0.5em;
  margin-bottom: 0.25em;

  .attachments, .attachment {
    margin: 0 0.5em 0 0;
    flex-grow: 1;
    height: 100%;
    box-sizing: border-box;
    // to make failed images a bit more noticeable on chromium
    min-width: 2em;
  }

  .image-attachment {
    width: 100%;
    height: 100%;
  }

  .video-container {
    height: 100%;
  }

  &.contain-fit {
    img, video {
      object-fit: contain;
    }
  }

  &.cover-fit {
    img, video {
      object-fit: cover;
    }
  }
}

</style>
