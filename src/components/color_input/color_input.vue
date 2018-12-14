<template>
<div class="color-control style-control" :class="{ disabled: !present || disabled }">
  <label :for="name" class="label">
    {{label}}
  </label>
  <input
    v-if="typeof fallback !== 'undefined'"
    class="opt exlcude-disabled"
    :id="name + '-o'"
    type="checkbox"
    :checked="present"
    @input="$emit('input', typeof value === 'undefined' ? fallback : undefined)">
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
  input.text-input {
    max-width: 7em;
    flex: 1;
  }
}
</style>
