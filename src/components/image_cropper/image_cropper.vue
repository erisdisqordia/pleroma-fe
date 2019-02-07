<template>
  <div class="image-cropper">
    <modal :show="dataUrl" :title="title" @close="destroy">
      <div class="modal-body">
        <div class="image-cropper-image-container">
          <img ref="img" :src="dataUrl" alt="" @load.stop="createCropper" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn image-cropper-btn" type="button" @click="submit" v-text="saveButtonLabel"></button>
      </div>
    </modal>
    <input ref="input" type="file" class="image-cropper-img-input" :accept="mimes">
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

  &-btn {
    display: block;
    width: 100%;
  }
}
</style>
