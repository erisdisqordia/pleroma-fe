<template>
<div class="font-control style-control" :class="{ custom: isCustom }">
  <label :for="preset === 'custom' ? name : name + '-font-switcher'" class="label">
    {{label}}
  </label>
  <input
    v-if="typeof fallback !== 'undefined'"
    class="opt exlcude-disabled"
    type="checkbox"
    :id="name + '-o'"
    :checked="present"
    @input="$emit('input', typeof value === 'undefined' ? fallback : undefined)">
  <label v-if="typeof fallback !== 'undefined'" class="opt-l" :for="name + '-o'"></label>
  <label :for="name + '-font-switcher'" class="select" :disabled="!present">
    <select
      :disabled="!present"
      v-model="preset"
      class="font-switcher"
      :id="name + '-font-switcher'">
      <option v-for="option in availableOptions" :value="option">
        {{ option === 'custom' ? $t('settings.style.fonts.custom') : option }}
      </option>
    </select>
    <i class="icon-down-open"/>
  </label>
  <input
    v-if="isCustom"
    class="custom-font"
    type="text"
    :id="name"
    v-model="family">
</div>
</template>

<script>
import { set } from 'vue'

export default {
  props: [
    'name', 'label', 'value', 'fallback', 'options', 'no-inherit'
  ],
  data () {
    return {
      lValue: this.value,
      availableOptions: [
        this.noInherit ? '' : 'inherit',
        'custom',
        ...(this.options || []),
        'serif',
        'monospace',
        'sans-serif'
      ].filter(_ => _)
    }
  },
  beforeUpdate () {
    this.lValue = this.value
  },
  computed: {
    present () {
      return typeof this.lValue !== 'undefined'
    },
    dValue () {
      return this.lValue || this.fallback || {}
    },
    family: {
      get () {
        return this.dValue.family
      },
      set (v) {
        set(this.lValue, 'family', v)
        this.$emit('input', this.lValue)
      }
    },
    isCustom () {
      return this.preset === 'custom'
    },
    preset: {
      get () {
        if (this.family === 'serif' ||
            this.family === 'sans-serif' ||
            this.family === 'monospace' ||
            this.family === 'inherit') {
          return this.family
        } else {
          return 'custom'
        }
      },
      set (v) {
        this.family = v === 'custom' ? '' : v
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../_variables.scss';
.font-control {
  input.custom-font {
    min-width: 10em;
  }
  &.custom {
    .select {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .custom-font {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
