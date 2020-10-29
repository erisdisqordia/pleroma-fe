<template>
  <div class="exporter">
    <div v-if="processing">
      <FAIcon
        icon="circle-notch"
        size="lg"
        spin
      />

      <span>{{ processingMessage }}</span>
    </div>
    <button
      v-else
      class="btn btn-default"
      @click="process"
    >
      {{ exportButtonLabel }}
    </button>
  </div>
</template>

<script src="./exporter.js"></script>

<style lang="scss">
.exporter {
  &-processing {
    margin: 0.25em;
  }
}
</style>
