<template>
  <div v-if="size==='hide'">
    <a class="placeholder" v-if="type !== 'html'" :href="attachment.url">[{{nsfw ? "NSFW/" : ""}}{{type.toUpperCase()}}]</a>
  </div>
  <div v-else class="attachment base03-border" :class="{[type]: true, loading, 'small-attachment': isSmall}" v-show="!isEmpty">
    <a class="image-attachment" v-if="hidden" @click.prevent="toggleHidden()">
      <img :key="nsfwImage" :src="nsfwImage"/>
    </a>
    <div class="hider" v-if="nsfw && hideNsfwLocal && !hidden">
      <a href="#" @click.prevent="toggleHidden()">Hide</a>
    </div>

    <a v-if="type === 'image' && !hidden" class="image-attachment" :href="attachment.url" target="_blank">
      <StillImage :class="{'small': isSmall}" class="base03-border" referrerpolicy="no-referrer" :mimetype="attachment.mimetype" :src="attachment.large_thumb_url || attachment.url"/>
    </a>

    <video :class="{'small': isSmall}" class="base03" v-if="type === 'video' && !hidden" :src="attachment.url" controls loop></video>

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
  .attachments {
      display: flex;
      flex-wrap: wrap;
      margin-right: -0.7em;

      .attachment.media-upload-container {
        flex: 0 0 auto;
        max-height: 300px;
        max-width: 100%;
      }

      .placeholder {
        margin-right: 0.5em;
      }

      .small-attachment {
        &.image, &.video {
          max-width: 35%;
        }
        max-height: 100px;
      }

      .attachment {
        flex: 1 0 30%;
        margin: 0.5em 0.7em 0.6em 0.0em;
        align-self: flex-start;

        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        overflow: hidden;
      }
      // fixes small gap below video
      &.video {
        line-height: 0;
      }

      &.html {
        flex-basis: 90%;
        width: 100%;
        display: flex;
      }

      &.loading {
        cursor: progress;
      }

      .hider {
          position: absolute;
          margin: 10px;
          padding: 5px;
          background: rgba(230,230,230,0.6);
          font-weight: bold;
          z-index: 4;
      }

      .small {
        max-height: 100px;
      }
      video {
          max-height: 500px;
          height: 100%;
          width: 100%;
          z-index: 0;
      }

      audio {
          width: 100%;
      }

      img.media-upload {
          margin-bottom: -2px;
          max-height: 300px;
          max-width: 100%;
      }

      .oembed {
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

          .still-image {
              width: 100%;
              height: 100%;
          }

          .small {
            img {
              max-height: 100px;
            }
          }

          img {
              object-fit: contain;
              width: 100%;
              height: 100%; /* If this isn't here, chrome will stretch the images */
              max-height: 500px;
              image-orientation: from-image;
          }
      }
 }
</style>
