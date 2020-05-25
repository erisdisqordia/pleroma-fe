<template>
  <div class="error-window panel">
    <div class="panel-heading">
      <span class="title">
        {{ $t('general.generic_error') }}
      </span>
    </div>
    <div class="panel-body">
      <p>
        {{ $t('general.error_retry') }}
      </p>
      <button
        class="btn"
        @click="closeAllModals"
      >
        {{ $t('general.close') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeAllModals () {
      // TODO make a global hook to close all modals?
      this.$store.dispatch('closeSettingsModal')
      this.$emit('resetAsyncComponent')
    }
  }
}
</script>

<style lang="scss">
.error-window {
  .btn {
    margin: .5em;
    padding: .5em 2em;
  }
}
</style>
