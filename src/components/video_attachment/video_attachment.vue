<template>
  <video
    class="video"
    :src="attachment.url"
    :loop="loopVideo"
    :controls="controls"
    :alt="attachment.description"
    :title="attachment.description"
    playsinline
    @loadeddata="onVideoDataLoad"
  />
</template>

<script src="./video_attachment.js"></script>
