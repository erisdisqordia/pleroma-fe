<template>
  <video
    class="video"
    :src="attachment.url"
    :loop="loopVideo"
    :controls="controls"
    :alt="attachment.description"
    :title="attachment.description"
    playsinline
    @playing="onPlaying"
    @pause="onPaused"
  />
</template>

<script src="./video_attachment.js"></script>
