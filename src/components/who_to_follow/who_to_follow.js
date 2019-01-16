import apiService from '../../services/api/api.service.js'
import UserCard from '../user_card/user_card.vue'

const WhoToFollow = {
  components: {
    UserCard
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
        const user = {
          id: 0,
          name: i.display_name,
          screen_name: i.acct,
          profile_image_url: i.avatar || '/images/avi.png'
        }
        this.users.push(user)

        this.$store.state.api.backendInteractor.externalProfile(user.screen_name)
          .then((externalUser) => {
            if (!externalUser.error) {
              this.$store.commit('addNewUsers', [externalUser])
              user.id = externalUser.id
            }
          })
      })
    },
    getWhoToFollow () {
      const credentials = this.$store.state.users.currentUser.credentials
      if (credentials) {
        apiService.suggestions({credentials: credentials})
          .then((reply) => {
            this.showWhoToFollow(reply)
          })
      }
    }
  }
}

export default WhoToFollow
