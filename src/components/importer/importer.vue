<template>
  <div class="importer">
    <form>
      <input type="file" ref="input" v-on:change="change" />
    </form>
    <i class="icon-spin4 animate-spin uploading" v-if="uploading"></i>
    <button class="btn btn-default" v-else @click="submit">{{$t('general.submit')}}</button>
    <div v-if="success">
      <i class="icon-cross" @click="dismiss"></i>
      <p>{{$t('settings.follows_imported')}}</p>
    </div>
    <div v-else-if="error">
      <i class="icon-cross" @click="dismiss"></i>
      <p>{{$t('settings.follow_import_error')}}</p>
    </div>
  </div>
</template>

<script src="./importer.js"></script>
