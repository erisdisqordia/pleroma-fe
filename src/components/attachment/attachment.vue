<template>
  <div class="attachment">
    <a v-if="nsfw" v-on:click.prevent="showNsfw()">
      <img :src="nsfwImage"></img>
    </a>

    <a v-if="type === 'image' && !nsfw" :href="attachment.url" target="_blank"><img :src="attachment.url"></img></a>
    <!-- <span ng-if="type === 'unknown'">Don't know how to display this...</span>


         <div ng-if="type === 'html' && attachment.oembed" class="oembed">
         <div ng-if="attachment.thumb_url" class="image">
         <img ng-src="{{::attachment.thumb_url}}"></img>
         </div>
         <div class="text">
         <h1><a href="{{::attachment.url}}">{{::attachment.oembed.title}}</a></h1>
         <div ng-bind-html="attachment.oembed.oembedHTML"></div>
         </div>
         </div>

         <video ng-if="type ==='webm'" ng-src="{{::videoUrl}}" controls></video> -->
  </div>
</template>

<script src="./attachment.js"></script>
