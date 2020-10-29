<template>
  <div
    class="media-upload"
    :class="{ disabled: disabled }"
  >
    <label
      class="label"
      :title="$t('tool_tip.media_upload')"
    >
      <FAIcon
        v-if="uploading"
        class="progress-icon"
        icon="circle-notch"
        spin
      />
      <FAIcon
        v-if="!uploading"
        class="new-icon"
        icon="upload"
      />
      <input
        v-if="uploadReady"
        :disabled="disabled"
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
@import '../../_variables.scss';

.media-upload {
  .label {
    display: inline-block;
  }

  .new-icon {
    cursor: pointer;
  }
}
 </style>
