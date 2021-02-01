import { defaultState as configDefaultState } from 'src/modules/config.js'

const SharedComputedObject = () => ({
  user () {
    return this.$store.state.users.currentUser
  },
  // Getting values for default properties
  ...Object.keys(configDefaultState)
    .map(key => [
      key + 'DefaultValue',
      function () {
        return this.$store.getters.defaultConfig[key]
      }
    ])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
  // Generating computed values for vuex properties
  ...Object.keys(configDefaultState)
    .map(key => [key, {
      get () { return this.$store.getters.mergedConfig[key] },
      set (value) {
        this.$store.dispatch('setOption', { name: key, value })
      }
    }])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
  // Special cases (need to transform values or perform actions first)
  useStreamingApi: {
    get () { return this.$store.getters.mergedConfig.useStreamingApi },
    set (value) {
      const promise = value
        ? this.$store.dispatch('enableMastoSockets')
        : this.$store.dispatch('disableMastoSockets')

      promise.then(() => {
        this.$store.dispatch('setOption', { name: 'useStreamingApi', value })
      }).catch((e) => {
        console.error('Failed starting MastoAPI Streaming socket', e)
        this.$store.dispatch('disableMastoSockets')
        this.$store.dispatch('setOption', { name: 'useStreamingApi', value: false })
      })
    }
  }
})

export default SharedComputedObject
