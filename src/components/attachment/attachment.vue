<template>
  <div class="attachment" :class="type">
    <a class="image-attachment" v-if="hidden" v-on:click.prevent="toggleHidden()">
      <img :key="nsfwImage" :src="nsfwImage"></img>
    </a>
    <div class="hider" v-if="nsfw && hideNsfwLocal && !hidden">
      <a href="#" @click.prevent="toggleHidden()">Hide</a>
    </div>

    <a class="image-attachment" v-if="type === 'image' && !hidden"
      :href="attachment.url" target="_blank">
      <img class="base05-border" referrerpolicy="no-referrer" :src="attachment.large_thumb_url || attachment.url"></img>
    </a>

    <video v-if="type === 'video' && !hidden" :src="attachment.url" controls></video>

    <audio v-if="type === 'audio'" :src="attachment.url" controls></audio>

    <div @click.prevent="linkClicked" v-if="type === 'html' && attachment.oembed" class="oembed">
      <div v-if="attachment.thumb_url" class="image">
        <img :src="attachment.thumb_url"></img>
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
      margin-right: -0.8em;
      .attachment {
          flex: 1 0 30%;
          margin: 0.5em 0.8em 0.6em 0.0em;
          align-self: flex-start;

          &.html {
            flex-basis: 100%;
            display: flex;
          }

          .hider {
              position: absolute;
              margin: 10px;
              padding: 5px;
              background: rgba(230,230,230,0.6);
              border-radius: 5px;
              font-weight: bold;
          }

          video {
              height: 100%;
              border: 1px solid;
              border-radius: 5px;
              width: 100%;
          }

          audio {
              width: 100%;
          }

          img.media-upload {
              width: 100%;
              height: 100%;
              flex: 1;
              border: 1px solid;
              border-radius: 5px;
          }


          .oembed {
              img {
                  width: 100%;
              }
              margin-right: 15px;
          }

          .oembed {
              border: 1px solid;
              width: 100%;

              display: flex;
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
                  width: 100%;
                  border-style: solid;
                  border-width: 1px;
                  border-radius: 5px;
                  width: 100%;
                  height: 100%; /* If this isn't here, chrome will stretch the images */
              }
          }
      }
 }
</style>
