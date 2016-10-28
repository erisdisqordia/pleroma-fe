<template>
  <div class="attachment">
    <a v-if="nsfw" v-on:click.prevent="showNsfw()">
      <img :src="nsfwImage"></img>
    </a>

    <a v-if="type === 'image' && !nsfw" :href="attachment.url" target="_blank"><img :src="attachment.url"></img></a>

    <video v-if="type === 'webm' && !nsfw" :src="attachment.url" controls></video>

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
 .attachment {
     video {
         height: 100%;
     }
 }
</style>
