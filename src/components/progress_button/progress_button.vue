<template>
  <button :disabled="progress || disabled" @click="onClick">
    <template v-if="progress">
      <slot name="progress" />
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean
    },
    click: { // click event handler. Must return a promise
      type: Function,
      default: () => Promise.resolve()
    }
  },
  data () {
    return {
      progress: false
    }
  },
  methods: {
    onClick () {
      this.progress = true
      this.click().then(() => { this.progress = false })
    }
  }
}
</script>
