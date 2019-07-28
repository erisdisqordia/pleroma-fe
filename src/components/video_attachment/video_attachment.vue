<template>
  <video
    class="video"
    :src="attachment.url"
    :loop="loopVideo"
    :controls="controls"
    playsinline
    @loadeddata="onVideoDataLoad"
  />
</template>

<script src="./video_attachment.js"></script>
