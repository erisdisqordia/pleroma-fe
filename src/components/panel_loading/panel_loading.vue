<template>
  <div class="panel-loading">
    <span class="loading-text">
      <i class="icon-spin4 animate-spin" />
      {{ $t('general.loading') }}
    </span>
  </div>
</template>

<style lang="scss">
@import 'src/_variables.scss';

.panel-loading {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  color: $fallback--text;
  color: var(--text, $fallback--text);
  .loading-text i {
    font-size: 3em;
    line-height: 0;
    vertical-align: middle;
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}
</style>
