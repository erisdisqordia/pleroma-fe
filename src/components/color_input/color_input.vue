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
    <input
      v-if="typeof fallback !== 'undefined'"
      :id="name + '-o'"
      class="opt exlcude-disabled"
      type="checkbox"
      :checked="present"
      @input="$emit('input', typeof value === 'undefined' ? fallback : undefined)"
    >
    <label
      v-if="typeof fallback !== 'undefined' && showOptionalTickbox"
      class="opt-l"
      :for="name + '-o'"
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
