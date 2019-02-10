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
    <button :title="$t('media_modal.previous')" class="modal-view-button-arrow modal-view-button-arrow--prev" v-if="canNavigate" @click.stop.prevent="goPrev"></button>
    <button :title="$t('media_modal.next')" class="modal-view-button-arrow modal-view-button-arrow--next" v-if="canNavigate" @click.stop.prevent="goNext"></button>
  </div>
</template>

<script src="./media_modal.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.modal-view {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);

  &-button-arrow {
    position: absolute;
    display: block;
    top: 50%;
    margin-top: -50px;
    width: 70px;
    height: 100px;
    border: 0;
    padding: 0;
    opacity: 0;
    box-shadow: none;
    background: none;
    appearance: none;
    overflow: visible;
    cursor: pointer;
    transition: opacity 333ms cubic-bezier(.4,0,.22,1);

    &:before {
      position: absolute;
      top: 35px;
      height: 30px;
      width: 32px;
      font-family: "fontello";
      font-size: 14px;
      line-height: 30px;
      color: #FFF;
      text-align: center;
      background-color: rgba(0,0,0,.3);
    }

    &:hover,
    &:focus {
      outline: none;
      box-shadow: none;
    }

    &#{&}#{&} {
      &:hover {
        opacity: 1;
      }
    }
    
    &--prev {
      left: 0;

      &:before {
        left: 6px;
        content: '\e80e';
      }
    }
      
    &--next {
      right: 0;

      &:before {
        right: 6px;
        content: '\e80d';
      }
    }
  }

  &:hover {
    .modal-view-button-arrow {
      opacity: .75;
    }
  }
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  box-shadow: 0px 5px 15px 0 rgba(0, 0, 0, 0.5);
}
</style>
