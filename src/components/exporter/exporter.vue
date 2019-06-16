<template>
  <div class="exporter">
    <div v-if="processing">
      <i class="icon-spin4 animate-spin exporter-processing"></i>
      <span>{{processingMessage}}</span>
    </div>
    <button class="btn btn-default" @click="process" v-else>{{exportButtonLabel}}</button>
  </div>
</template>

<script src="./exporter.js"></script>

<style lang="scss">
.exporter {
  &-processing {
    font-size: 1.5em;
    margin: 0.25em;
  }
}
</style>
