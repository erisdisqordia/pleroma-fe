<template>
  <video class="video"
    @loadeddata="onVideoDataLoad"
    :src="attachment.url"
    :loop="loopVideo"
    :controls="controls"
    playsinline
  />
</template>

<script src="./video_attachment.js"></script>
