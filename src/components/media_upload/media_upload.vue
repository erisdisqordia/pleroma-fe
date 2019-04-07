<template>
  <div
    class="media-upload"
    @drop.prevent
    @dragover.prevent="fileDrag"
    @drop="fileDrop"
  >
    <label
      class="btn btn-default"
      :title="$t('tool_tip.media_upload')"
    >
      <i
        v-if="uploading"
        class="icon-spin4 animate-spin"
      />
      <i
        v-if="!uploading"
        class="icon-upload"
      />
      <input
        v-if="uploadReady"
        type="file"
        style="position: fixed; top: -100em"
        multiple="true"
        @change="change"
      >
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
