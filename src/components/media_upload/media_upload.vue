<template>
  <div class="media-upload">
    <label class="btn btn-default">
      <i class="fa icon-spin4 animate-spin" v-if="uploading"></i>
      <i class="fa icon-upload" v-if="!uploading"></i>
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
