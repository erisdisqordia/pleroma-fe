<template>
  <div class="modal-view" v-if="showing" @click.prevent="hide">
    <img class="modal-image" v-if="type === 'image'" :src="currentMedia.url"></img>
    <VideoAttachment
      class="modal-image"
      v-if="type === 'video'"
      :attachment="currentMedia"
      :controls="true"
      @click.stop.native="">
    </VideoAttachment>
  </div>
</template>

<script src="./media_modal.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.modal-view {
  z-index: 1000;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  box-shadow: 0px 5px 15px 0 rgba(0, 0, 0, 0.5);
}
</style>
