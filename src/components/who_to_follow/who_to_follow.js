import apiService from '../../services/api/api.service.js'
import FollowCard from '../follow_card/follow_card.vue'

const WhoToFollow = {
  components: {
    FollowCard
  },
  data () {
    return {
      users: []
    }
  },
  mounted () {
    this.getWhoToFollow()
  },
  methods: {
    showWhoToFollow (reply) {
      reply.forEach((i, index) => {
        this.$store.state.api.backendInteractor.fetchUser({ id: i.acct })
          .then((externalUser) => {
            if (!externalUser.error) {
              this.$store.commit('addNewUsers', [externalUser])
              this.users.push(externalUser)
            }
          })
      })
    },
    getWhoToFollow () {
      const credentials = this.$store.state.users.currentUser.credentials
      if (credentials) {
        apiService.suggestions({ credentials: credentials })
          .then((reply) => {
            this.showWhoToFollow(reply)
          })
      }
    }
  }
}

export default WhoToFollow
