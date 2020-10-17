<template>
  <span
    v-if="changed"
    class="ModifiedIcon"
    >
    <Popover
      trigger="hover"
      >
      <i
        slot="trigger"
        class="icon icon-wrench"
        />
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
export default {
  props: ['changed'],
  components: { Popover }
}
</script>

<style lang="scss">
.ModifiedIcon {
  display: inline-block;
  position: relative;

  .icon {
    display: inline-block;
  }

  .modified-tooltip {
    margin: 0.5em 1em;
    min-width: 10em;
    text-align: center;
  }
}
</style>
