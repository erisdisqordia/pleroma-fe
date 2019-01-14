<template>
  <div v-if="usePlaceHolder" @click="toggleModal">
    <a class="placeholder" v-if="type !== 'html'" target="_blank" :href="attachment.url">[{{nsfw ? "NSFW/" : ""}}{{type.toUpperCase()}}]</a>
  </div>
  <div
    v-else class="attachment"
    :class="{[type]: true, loading, 'small-attachment': isSmall, 'fullwidth': fullwidth, 'nsfw-placeholder': hidden}"
    v-show="!isEmpty"
    @click="toggleModal"
  >
    <a class="image-attachment" v-if="hidden" @click.prevent="toggleHidden()">
      <img :key="nsfwImage" :src="nsfwImage"/>
    </a>
    <div class="hider" v-if="nsfw && hideNsfwLocal && !hidden">
      <a href="#" @click.prevent="toggleHidden()">Hide</a>
    </div>
    <a v-if="type === 'image' && (!hidden || preloadImage)"
      class="image-attachment"
      :class="{'hidden': hidden && preloadImage}"
      :href="attachment.url" target="_blank"
      :title="attachment.description"
    >
      <StillImage :class="{'small': isSmall}" referrerpolicy="no-referrer" :mimetype="attachment.mimetype" :src="attachment.large_thumb_url || attachment.url"/>
    </a>

    <video :class="{'small': isSmall}" v-if="type === 'video' && !hidden" :src="attachment.url"></video>

    <audio v-if="type === 'audio'" :src="attachment.url" controls></audio>

    <div @click.prevent="linkClicked" v-if="type === 'html' && attachment.oembed" class="oembed">
      <div v-if="attachment.thumb_url" class="image">
        <img :src="attachment.thumb_url"/>
      </div>
      <div class="text">
        <h1><a :href="attachment.url">{{attachment.oembed.title}}</a></h1>
        <div v-html="attachment.oembed.oembedHTML"></div>
      </div>
    </div>
  </div>
</template>

<script src="./attachment.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.attachments {
  display: flex;
  flex-wrap: wrap;

  .attachment.media-upload-container {
    flex: 0 0 auto;
    max-height: 160px;
    max-width: 100%;
  }

  .placeholder {
    margin-right: 8px;
    margin-bottom: 4px;
  }

  .nsfw-placeholder {
    cursor: pointer;

    &.loading {
      cursor: progress;
    }
  }

  .small-attachment {
    max-height: 100px;
  }

  .attachment {
    position: relative;
    margin: 0.5em 0.5em 0em 0em;
    align-self: flex-start;
    line-height: 0;

    border-style: solid;
    border-width: 1px;
    border-radius: $fallback--attachmentRadius;
    border-radius: var(--attachmentRadius, $fallback--attachmentRadius);
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
    overflow: hidden;
  }
  .fullwidth {
    flex-basis: 100%;
  }
  // fixes small gap below video
  &.video {
    line-height: 0;
  }

  .video {
    object-fit: cover;
  }

  &.html {
    flex-basis: 90%;
    width: 100%;
    display: flex;
  }

  .hider {
    position: absolute;
    margin: 10px;
    padding: 5px;
    background: rgba(230,230,230,0.6);
    font-weight: bold;
    z-index: 4;
    line-height: 1;
    border-radius: $fallback--tooltipRadius;
    border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
  }

  .small {
    max-height: 100px;
  }

  video {
    max-height: 160px;
    height: 100%;
    z-index: 0;
  }

  audio {
    width: 100%;
  }

  img.media-upload {
    line-height: 0;
    max-height: 160px;
    max-width: 100%;
  }

  .oembed {
    line-height: 1.2em;
    flex: 1 0 100%;
    width: 100%;
    margin-right: 15px;
    display: flex;

    img {
      width: 100%;
    }

    .image {
      flex: 1;
      img {
        border: 0px;
        border-radius: 5px;
        height: 100%;
        object-fit: cover;
      }
    }

    .text {
      flex: 2;
      margin: 8px;
      word-break: break-all;
      h1 {
        font-size: 14px;
        margin: 0px;
      }
    }
  }

  .image-attachment {
    display: flex;
    flex: 1;

    &.hidden {
      display: none;
    }

    .still-image {
      height: 100%;
    }

    .small {
      img {
        max-height: 80px;
      }
    }

    img {
      object-fit: cover;
      height: 100%; /* If this isn't here, chrome will stretch the images */
      height: 160px;
      image-orientation: from-image;
    }
  }
}
</style>
