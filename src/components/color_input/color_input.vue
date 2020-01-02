<template>
  <div
    class="color-control style-control"
    :class="{ disabled: !present || disabled }"
  >
    <label
      :for="name"
      class="label"
    >
      {{ label }}
    </label>
    <Checkbox
      v-if="typeof fallback !== 'undefined' && showOptionalTickbox"
      :checked="present"
      :disabled="disabled"
      @change="$emit('input', typeof value === 'undefined' ? fallback : undefined)"
      class="opt"
    />
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
import Checkbox from '../checkbox/checkbox.vue'
export default {
  props: {
    // Name of color, used for identifying
    name: {
      required: true,
      type: String
    },
    // Readable label
    label: {
      required: true,
      type: String
    },
    // Color value, should be required but vue cannot tell the difference
    // between "property missing" and "property set to undefined"
    value: {
      required: false,
      type: String,
      default: undefined
    },
    // Color fallback to use when value is not defeind
    fallback: {
      required: false,
      type: String,
      default: undefined
    },
    // Disable the control
    disabled: {
      required: false,
      type: Boolean,
      default: false
    },
    // Show "optional" tickbox, for when value might become mandatory
    showOptionalTickbox: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  components: {
    Checkbox
  },
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
