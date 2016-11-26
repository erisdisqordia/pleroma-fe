<template>
  <div class="attachment">
    <a class="image-attachment" v-if="nsfw" v-on:click.prevent="showNsfw()">
      <img :key="nsfwImage" :src="nsfwImage"></img>
    </a>

    <a class="image-attachment" v-if="type === 'image' && !nsfw"
      :href="attachment.url" target="_blank">
      <img :src="attachment.url"></img>
    </a>

    <video v-if="type === 'video' && !nsfw" :src="attachment.url" controls></video>

    <audio v-if="type === 'audio'" :src="attachment.url" controls></audio>

    <span v-if="type === 'unknown'">Don't know how to display this...</span>

    <div v-if="type === 'html' && attachment.oembed" class="oembed">
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
      .attachment {

          flex: 1 0 30%;
          display: flex;
          margin: 0.2em;
          align-self: flex-start;

          video {
              height: 100%;
              border: 1px solid;
              border-radius: 0.5em;
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
              border-radius: 0.5em;
          }


          .oembed {
              img {
                  width: 100%;
                  height: 100%;
              }
          }

          .oembed {
              border: 1px solid rgba(0, 0, 0, 0.14);
              width: 100%;

              display: flex;
              .image {
                  flex: 1;
                  img {
                      border: 0px;
                      border-radius: 0;
                  }
              }

              .text {
                  flex: 2;
                  margin: 8px;
                  h1 {
                      font-size: 14px;
                      margin: 0px;

                      a {
                          color: black;
                      }
                  }
              }
          }

          a.image-attachment {
              display: flex;
              flex: 1;

              img {
                  width: 100%;
                  border: 1px solid;
                  border-radius: 0.5em;
                  width: 100%;
                  height: 100%; /* If this isn't here, chrome will stretch the images */
              }
          }
      }
 }
</style>
