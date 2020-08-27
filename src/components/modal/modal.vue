<template>
  <div
    v-show="isOpen"
    v-body-scroll-lock="isOpen && !noBackground"
    class="modal-view"
    :class="classes"
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
    },
    noBackground: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes () {
      return {
        'modal-background': !this.noBackground,
        'open': this.isOpen
      }
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
  pointer-events: none;
  animation-duration: 0.2s;
  animation-name: modal-background-fadein;
  opacity: 0;

  > * {
    pointer-events: initial;
  }

  &.modal-background {
    pointer-events: initial;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &.open {
    opacity: 1;
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
