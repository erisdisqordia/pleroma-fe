<template>
  <div
    v-show="isOpen"
    v-body-scroll-lock="isOpen"
    class="modal-view"
    @click.self="$emit('backdropClicked')"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
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
  overflow: auto;
  animation-duration: 0.2s;
  background-color: rgba(0, 0, 0, 0.5);
  animation-name: modal-background-fadein;

  body:not(.scroll-locked) & {
    opacity: 0;
  }
}

@keyframes modal-background-fadein {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
