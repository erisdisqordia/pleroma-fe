import BasicUserCard from '../basic_user_card/basic_user_card.vue'

const FollowRequestCard = {
  props: ['user'],
  components: {
    BasicUserCard
  },
  methods: {
    approveUser () {
      this.$store.state.api.backendInteractor.approveUser({ id: this.user.id })
      this.$store.dispatch('removeFollowRequest', this.user)
    },
    denyUser () {
      this.$store.state.api.backendInteractor.denyUser({ id: this.user.id })
      this.$store.dispatch('removeFollowRequest', this.user)
    }
  }
}

export default FollowRequestCard
