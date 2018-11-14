<template>
<div class="opacity-control" :class="{ disabled: !present }">
  <label :for="name" class="label">
    {{$t('settings.opacity')}}
  </label>
  <input
  v-if="typeof fallback !== 'undefined'"
  class="opt"
  :id="name + '-o'"
      type="checkbox"
  :checked="present"
           @input="$emit('input', !present ? fallback : undefined)"
           >
  <label v-if="typeof fallback !== 'undefined'" class="opt-l" :for="name + '-o'"></label>
  <input
    :id="name"
    class="input-number"
    type="number"
    :value="value || fallback"
    :disabled="!present"
    @input="$emit('input', $event.target.value)"
    max="1"
    min="0"
    step=".05">
</div>
</template>

<script>
export default {
  props: [
    'name', 'value', 'fallback'
  ],
  computed: {
    present () {
      return typeof this.value !== 'undefined'
    }
  }
}
</script>

<style lang="scss">
.opacity-control {
  display: flex;
  align-items: baseline;

  &.disabled *:not(.opt-l) {
    opacity: .5
  }

  .opt-l {
    align-self: center;
    &::before {
      width: 14px;
      height: 14px;
    }
  }

  .label {
    flex: 2;
    min-width: 7em;
  }

  .input-range {
    background: none;
    border: none;
    margin: 0;
    height: auto;
    box-shadow: none;
    min-width: 7em;
    flex: 1;
  }

  .input-number {
    margin: 0;
    min-width: 4em;
    flex: 0;
  }
}
</style>
