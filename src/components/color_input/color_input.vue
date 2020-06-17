<template>
  <div
    class="color-input style-control"
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
      class="opt"
      @change="$emit('input', typeof value === 'undefined' ? fallback : undefined)"
    />
    <div class="input color-input-field">
      <input
        :id="name + '-t'"
        class="textColor unstyled"
        type="text"
        :value="value || fallback"
        :disabled="!present || disabled"
        @input="$emit('input', $event.target.value)"
      >
      <input
        v-if="validColor"
        :id="name"
        class="nativeColor unstyled"
        type="color"
        :value="value || fallback"
        :disabled="!present || disabled"
        @input="$emit('input', $event.target.value)"
      >
      <div
        v-if="transparentColor"
        class="transparentIndicator"
      />
      <div
        v-if="computedColor"
        class="computedIndicator"
        :style="{backgroundColor: fallback}"
      />
    </div>
  </div>
</template>
<style lang="scss" src="./color_input.scss"></style>
<script>
import Checkbox from '../checkbox/checkbox.vue'
import { hex2rgb } from '../../services/color_convert/color_convert.js'
export default {
  components: {
    Checkbox
  },
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
    },
    validColor () {
      return hex2rgb(this.value || this.fallback)
    },
    transparentColor () {
      return this.value === 'transparent'
    },
    computedColor () {
      return this.value && this.value.startsWith('--')
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
