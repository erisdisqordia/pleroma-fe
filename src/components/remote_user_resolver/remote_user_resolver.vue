<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      {{ $t('remote_user_resolver.remote_user_resolver') }}
    </div>
    <div class="panel-body">
      <p>
        {{ $t('remote_user_resolver.searching_for') }} @{{ $route.params.username }}@{{ $route.params.hostname }}
      </p>
      <p v-if="error">
        {{ $t('remote_user_resolver.error') }}
      </p>
    </div>
  </div>
</template>

<script src="./remote_user_resolver.js"></script>

<style lang="scss">
</style>
