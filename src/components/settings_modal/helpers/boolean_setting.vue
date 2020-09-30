<template>
  <label
    class="BooleanSetting"
  >
    <Checkbox
      :checked="state"
      @change="update"
      :disabled="disabled"
      >
      <span
        v-if="!!$slots.default"
        class="label"
        >
        <slot />
      </span>
    </Checkbox>
    <span v-if="isChanged">
      <strong>CHANGED</strong>
    </span>
  </label>
</template>

<script>
import { get, set } from 'lodash'
import Checkbox from 'src/components/checkbox/checkbox.vue'
export default {
  props: [
    'path',
    'disabled'
  ],
  components: {
    Checkbox
  },
  computed: {
    pathDefault () {
      const [firstSegment, ...rest] = this.path.split('.')
      return [firstSegment + 'DefaultValue', ...rest].join('.')
    },
    state () {
      return get(this.$parent, this.path)
    },
    isChanged () {
      return get(this.$parent, this.path) !== get(this.$parent, this.pathDefault)
    }
  },
  methods: {
    update (e) {
      set(this.$parent, this.path, e)
    }
  }
}
</script>

<style lang="scss">
.BooleanSetting {
}
</style>
