<template>
  <div class="importer">
    <form>
      <input
        ref="input"
        type="file"
        @change="change"
      >
    </form>
    <FAIcon
      v-if="submitting"
      class="importer-uploading"
      spin
      icon="circle-notch"
    />
    <button
      v-else
      class="btn btn-default"
      @click="submit"
    >
      {{ submitButtonLabel }}
    </button>
    <div v-if="success">
      <FAIcon
        icon="times"
        @click="dismiss"
      />
      <p>{{ successMessage }}</p>
    </div>
    <div v-else-if="error">
      <FAIcon
        icon="times"
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
