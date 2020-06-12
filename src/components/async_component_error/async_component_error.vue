<template>
  <div class="async-component-error">
    <div>
      <h4>
        {{ $t('general.generic_error') }}
      </h4>
      <p>
        {{ $t('general.error_retry') }}
      </p>
      <button
        class="btn"
        @click="retry"
      >
        {{ $t('general.retry') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    retry () {
      this.$emit('resetAsyncComponent')
    }
  }
}
</script>

<style lang="scss">
.async-component-error {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  .btn {
    margin: .5em;
    padding: .5em 2em;
  }
}
</style>
