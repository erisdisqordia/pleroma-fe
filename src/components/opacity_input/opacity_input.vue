<template>
  <div
    class="opacity-control style-control"
    :class="{ disabled: !present || disabled }"
  >
    <label
      :for="name"
      class="label"
    >
      {{ $t('settings.style.common.opacity') }}
    </label>
    <input
      v-if="typeof fallback !== 'undefined'"
      :id="name + '-o'"
      class="opt exclude-disabled"
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
      type="number"
      :value="value || fallback"
      :disabled="!present || disabled"
      max="1"
      min="0"
      step=".05"
      @input="$emit('input', $event.target.value)"
    >
  </div>
</template>

<script>
export default {
  props: [
    'name', 'value', 'fallback', 'disabled'
  ],
  computed: {
    present () {
      return typeof this.value !== 'undefined'
    }
  }
}
</script>
