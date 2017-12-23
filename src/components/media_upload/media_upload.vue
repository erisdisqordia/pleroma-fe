<template>
  <div class="media-upload" @drop.prevent @dragover.prevent="fileDrag" @drop="fileDrop">
    <label class="btn btn-default">
      <i class="base09 icon-spin4 animate-spin" v-if="uploading"></i>
      <i class="base09 icon-upload" v-if="!uploading"></i>
      <input type=file style="position: fixed; top: -100em"></input>
    </label>
  </div>
</template>

<script src="./media_upload.js" ></script>

<style>
 .media-upload {
     font-size: 26px;
     flex: 1;
 }

 .icon-upload {
     cursor: pointer;
 }
</style>
