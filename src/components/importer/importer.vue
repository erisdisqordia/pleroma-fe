<template>
  <div class="importer">
    <form>
      <input type="file" ref="input" v-on:change="change" />
    </form>
    <i class="icon-spin4 animate-spin importer-uploading" v-if="submitting"></i>
    <button class="btn btn-default" v-else @click="submit">{{submitButtonLabel}}</button>
    <div v-if="success">
      <i class="icon-cross" @click="dismiss"></i>
      <p>{{successMessage}}</p>
    </div>
    <div v-else-if="error">
      <i class="icon-cross" @click="dismiss"></i>
      <p>{{errorMessage}}</p>
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
