<template>
  <span
    v-if="changed"
    class="ModifiedIndicator"
    >
    <Popover
      trigger="hover"
      >
      <span slot="trigger">
        &nbsp;
          <FAIcon
            icon="wrench"
          />
      </span>
      <div
        class="modified-tooltip"
        slot="content"
        >
      {{ $t('settings.setting_changed') }}
      </div>
    </Popover>
  </span>
</template>

<script>
import Popover from 'src/components/popover/popover.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faWrench } from '@fortawesome/free-solid-svg-icons'

library.add(
  faWrench
)

export default {
  props: ['changed'],
  components: { Popover }
}
</script>

<style lang="scss">
.ModifiedIndicator {
  display: inline-block;
  position: relative;

  .modified-tooltip {
    margin: 0.5em 1em;
    min-width: 10em;
    text-align: center;
  }
}
</style>
