<template>
  <div class="panel-loading">
    <span class="loading-text">
      <FAIcon
        icon="circle-notch"
        spin
        size="3x"
      />
      {{ $t('general.loading') }}
    </span>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

library.add(
  faCircleNotch
)

export default {}
</script>

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
  .loading-text svg {
    line-height: 0;
    vertical-align: middle;
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}
</style>
