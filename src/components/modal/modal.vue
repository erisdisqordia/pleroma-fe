<template>
  <div
    v-body-scroll-lock="true"
    @click.self="closeModal"
    class="modal-view"
  >
    <slot />
  </div>
</template>

<script>
export default {
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">

.modal-view {
  body:not(.scroll-locked) & {
    display: none;
  }
}

</style>
