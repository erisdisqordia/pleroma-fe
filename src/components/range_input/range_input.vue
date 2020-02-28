<template>
  <div
    class="range-control style-control"
    :class="{ disabled: !present || disabled }"
  >
    <label
      :for="name"
      class="label"
    >
      {{ label }}
    </label>
    <input
      v-if="typeof fallback !== 'undefined'"
      :id="name + '-o'"
      class="opt"
      type="checkbox"
      :checked="present"
      @input="$emit('input', !present ? fallback : undefined)"
    >
    <label
      v-if="typeof fallback !== 'undefined'"
      class="opt-l"
      :for="name + '-o'"
    />
    <input
      :id="name"
      class="input-number"
      type="range"
      :value="value || fallback"
      :disabled="!present || disabled"
      :max="max || hardMax || 100"
      :min="min || hardMin || 0"
      :step="step || 1"
      @input="$emit('input', $event.target.value)"
    >
    <input
      :id="name"
      class="input-number"
      type="number"
      :value="value || fallback"
      :disabled="!present || disabled"
      :max="hardMax"
      :min="hardMin"
      :step="step || 1"
      @input="$emit('input', $event.target.value)"
    >
  </div>
</template>

<script>
export default {
  props: [
    'name', 'value', 'fallback', 'disabled', 'label', 'max', 'min', 'step', 'hardMin', 'hardMax'
  ],
  computed: {
    present () {
      return typeof this.value !== 'undefined'
    }
  }
}
</script>
