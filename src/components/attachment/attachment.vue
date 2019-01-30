<template>
  <div v-if="usePlaceHolder" @click="openModal">
    <a class="placeholder"
      v-if="type !== 'html'"
      target="_blank" :href="attachment.url"
    >
      [{{nsfw ? "NSFW/" : ""}}{{type.toUpperCase()}}]
    </a>
  </div>
  <div
    v-else class="attachment"
    :class="{[type]: true, loading, 'fullwidth': fullwidth, 'nsfw-placeholder': hidden}"
    v-show="!isEmpty"
  >
    <a class="image-attachment" v-if="hidden" :href="attachment.url" @click.prevent="toggleHidden">
      <img class="nsfw" :key="nsfwImage" :src="nsfwImage" :class="{'small': isSmall}"/>
      <i v-if="type === 'video'" class="play-icon icon-play-circled"></i>
    </a>
    <div class="hider" v-if="nsfw && hideNsfwLocal && !hidden">
      <a href="#" @click.prevent="toggleHidden">Hide</a>
    </div>

    <a v-if="type === 'image' && (!hidden || preloadImage)"
      @click="openModal"
      class="image-attachment"
      :class="{'hidden': hidden && preloadImage }"
      :href="attachment.url" target="_blank"
      :title="attachment.description"
    >
      <StillImage :referrerpolicy="referrerpolicy" :mimetype="attachment.mimetype" :src="attachment.large_thumb_url || attachment.url"/>
    </a>

    <a class="video-container"
      @click="openModal"
      v-if="type === 'video' && !hidden"
      :class="{'small': isSmall}"
      :href="allowPlay ? undefined : attachment.url"
    >
      <VideoAttachment class="video" :attachment="attachment" :controls="allowPlay" />
      <i v-if="!allowPlay" class="play-icon icon-play-circled"></i>
    </a>

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
    max-height: 200px;
    max-width: 100%;
    display: flex;
    video {
      max-width: 100%;
    }
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

  .non-gallery.attachment {
    &.video {
      flex: 1 0 40%;
    }
    .nsfw {
      height: 260px;
    }
    .small {
      height: 120px;
      flex-grow: 0;
    }
    .video {
      height: 260px;
      display: flex;
    }
    video {
      max-height: 100%;
      object-fit: contain;
    }
  }

  .fullwidth {
    flex-basis: 100%;
  }
  // fixes small gap below video
  &.video {
    line-height: 0;
  }

  .video-container {
    display: flex;
    max-height: 100%;
  }

  .video {
    width: 100%;
  }

  .play-icon {
    position: absolute;
    font-size: 64px;
    top: calc(50% - 32px);
    left: calc(50% - 32px);
    color: rgba(255, 255, 255, 0.75);
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
  }

  .play-icon::before {
    margin: 0;
  }

  &.html {
    flex-basis: 90%;
    width: 100%;
    display: flex;
  }

  .hider {
    position: absolute;
    white-space: nowrap;
    margin: 10px;
    padding: 5px;
    background: rgba(230,230,230,0.6);
    font-weight: bold;
    z-index: 4;
    line-height: 1;
    border-radius: $fallback--tooltipRadius;
    border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
  }

  video {
    z-index: 0;
  }

  audio {
    width: 100%;
  }

  img.media-upload {
    line-height: 0;
    max-height: 200px;
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
    width: 100%;
    height: 100%;

    &.hidden {
      display: none;
    }

    .nsfw {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    img {
      image-orientation: from-image;
    }
  }
}
</style>
