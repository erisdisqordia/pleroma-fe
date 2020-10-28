<template>
  <div class="image-cropper">
    <div v-if="dataUrl">
      <div class="image-cropper-image-container">
        <img
          ref="img"
          :src="dataUrl"
          alt=""
          @load.stop="createCropper"
        >
      </div>
      <div class="image-cropper-buttons-wrapper">
        <button
          class="btn"
          type="button"
          :disabled="submitting"
          @click="submit()"
          v-text="saveText"
        />
        <button
          class="btn"
          type="button"
          :disabled="submitting"
          @click="destroy"
          v-text="cancelText"
        />
        <button
          class="btn"
          type="button"
          :disabled="submitting"
          @click="submit(false)"
          v-text="saveWithoutCroppingText"
        />
        <FAIcon
          v-if="submitting"
          spin
          icon="circle-notch"
        />
      </div>
      <div
        v-if="submitError"
        class="alert error"
      >
        {{ submitErrorMsg }}
        <FAIcon
          class="fa-scale-110 fa-old-padding"
          icon="times"
          @click="clearError"
        />
      </div>
    </div>
    <input
      ref="input"
      type="file"
      class="image-cropper-img-input"
      :accept="mimes"
    >
  </div>
</template>

<script src="./image_cropper.js"></script>

<style lang="scss">
.image-cropper {
  &-img-input {
    display: none;
  }

  &-image-container {
    position: relative;

    img {
      display: block;
      max-width: 100%;
    }
  }

  &-buttons-wrapper {
    margin-top: 10px;

    button {
      margin-top: 5px;
    }
  }
}
</style>
