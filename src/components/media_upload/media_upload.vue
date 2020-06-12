<template>
  <div class="media-upload">
    <label
      class="label"
      :title="$t('tool_tip.media_upload')"
    >
      <i
        v-if="uploading"
        class="progress-icon icon-spin4 animate-spin"
      />
      <i
        v-if="!uploading"
        class="new-icon icon-upload"
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

<style lang="scss">
.media-upload {
  .label {
    display: inline-block;
  }

  .new-icon {
    cursor: pointer;
  }

  .progress-icon {
    display: inline-block;
    line-height: 0;
    &::before {
      /* Overriding fontello to achieve the perfect speeeen */
      margin: 0;
      line-height: 0;
    }
  }
}
 </style>
