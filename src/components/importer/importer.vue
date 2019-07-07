<template>
  <div class="importer">
    <form>
      <input
        ref="input"
        type="file"
        @change="change"
      >
    </form>
    <i
      v-if="submitting"
      class="icon-spin4 animate-spin importer-uploading"
    />
    <button
      v-else
      class="btn btn-default"
      @click="submit"
    >
      {{ submitButtonLabel }}
    </button>
    <div v-if="success">
      <i
        class="icon-cross"
        @click="dismiss"
      />
      <p>{{ successMessage }}</p>
    </div>
    <div v-else-if="error">
      <i
        class="icon-cross"
        @click="dismiss"
      />
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script src="./importer.js"></script>

<style lang="scss">
.importer {
  &-uploading {
    font-size: 1.5em;
    margin: 0.25em;
  }
}
</style>
