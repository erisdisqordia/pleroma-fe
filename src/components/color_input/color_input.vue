<template>
<div class="color-control" :class="{ disabled: !present || disabled }">
  <label :for="name" class="label">
    {{label}}
  </label>
  <input
  v-if="typeof fallback !== 'undefined'"
  class="opt"
  :id="name + '-o'"
      type="checkbox"
  :checked="present"
           @input="$emit('input', typeof value === 'undefined' ? fallback : undefined)"
           >
           <label v-if="typeof fallback !== 'undefined'" class="opt-l" :for="name + '-o'"></label>
  <input
    :id="name"
    class="color-input"
    type="color"
    :value="value || fallback"
    :disabled="!present || disabled"
    @input="$emit('input', $event.target.value)"
    >
  <input
    :id="name + '-t'"
    class="text-input"
    type="text"
    :value="value || fallback"
    :disabled="!present || disabled"
    @input="$emit('input', $event.target.value)"
    >
</div>
</template>

<script>
export default {
  props: [
    'name', 'label', 'value', 'fallback', 'disabled'
  ],
  computed: {
    present () {
      return typeof this.value !== 'undefined'
    }
  }
}
</script>

<style lang="scss">
.color-control {
  display: flex;
  align-items: baseline;

  &.disabled *:not(.opt-l){
    opacity: .5
  }

  .label {
    flex: 2;
    min-width: 7em;
  }

  .opt-l {
    align-self: center;
    flex: 0;
    &::before {
      width: 14px;
      height: 14px;
    }
  }

  .text-input {
    max-width: 7em;
    flex: 1;
  }

  .color-input {
    flex: 0;
    padding: 1px;
    cursor: pointer;
    height: 29px;
    min-width: 2em;
    border: none;
    align-self: stretch;
  }
}
</style>
