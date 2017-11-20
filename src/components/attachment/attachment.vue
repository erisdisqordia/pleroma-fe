<template>
  <div class="attachment base03-border" :class="{[type]: true, loading}" v-show="!isEmpty">
    <a class="image-attachment" v-if="hidden" @click.prevent="toggleHidden()">
      <img :key="nsfwImage" :src="nsfwImage"/>
    </a>
    <div class="hider" v-if="nsfw && hideNsfwLocal && !hidden">
      <a href="#" @click.prevent="toggleHidden()">Hide</a>
    </div>

    <a v-if="type === 'image' && !hidden" class="image-attachment" :href="attachment.url" target="_blank">
      <img class="base03-border" referrerpolicy="no-referrer" :src="attachment.large_thumb_url || attachment.url"/>
    </a>

    <video class="base03" v-if="type === 'video' && !hidden" :src="attachment.url" controls loop></video>

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
      .attachment {
          flex: 1 0 30%;
          margin: 0.5em 0.7em 0.6em 0.0em;
          align-self: flex-start;

          border-style: solid;
          border-width: 1px;
          border-radius: 5px;
          overflow: hidden;

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
              width: 100%;
              height: 100%;
              flex: 1;
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

          a.image-attachment {
              display: flex;
              flex: 1;

              img {
                  object-fit: contain;
                  width: 100%;
                  height: 100%; /* If this isn't here, chrome will stretch the images */
                  max-height: 500px;
              }
          }
      }
 }
</style>
