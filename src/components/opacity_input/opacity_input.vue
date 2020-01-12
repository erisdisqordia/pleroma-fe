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
    <Checkbox
      v-if="typeof fallback !== 'undefined'"
      :checked="present"
      :disabled="disabled"
      class="opt"
      @change="$emit('input', !present ? fallback : undefined)"
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
import Checkbox from '../checkbox/checkbox.vue'
export default {
  components: {
    Checkbox
  },
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
