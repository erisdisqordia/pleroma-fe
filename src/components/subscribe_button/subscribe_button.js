export default {
  props: [ 'user' ],
  data () {
    return {
      inProgress: false
    }
  },
  methods: {
    subscribe () {
      this.inProgress = true
      this.$store.state.api.backendInteractor.subscribeUser(this.user.id)
        .then((updated) => {
          console.log(updated)
          this.inProgress = false
        })
    },
    unsubscribe () {
      this.inProgress = true
      this.$store.state.api.backendInteractor.unsubscribeUser(this.user.id)
        .then((updated) => {
          console.log(updated)
          this.inProgress = false
        })
    }
  }
}
