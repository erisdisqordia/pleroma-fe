import { mapState, mapGetters } from 'vuex'
import BasicUserCard from '../basic_user_card/basic_user_card.vue'
import UserAvatar from '../user_avatar/user_avatar.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSearch,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faSearch,
  faChevronLeft
)

const chatNew = {
  components: {
    BasicUserCard,
    UserAvatar
  },
  data () {
    return {
      suggestions: [],
      userIds: [],
      loading: false,
      query: ''
    }
  },
  async created () {
    const { chats } = await this.backendInteractor.chats()
    chats.forEach(chat => this.suggestions.push(chat.account))
  },
  computed: {
    users () {
      return this.userIds.map(userId => this.findUser(userId))
    },
    availableUsers () {
      if (this.query.length !== 0) {
        return this.users
      } else {
        return this.suggestions
      }
    },
    ...mapState({
      currentUser: state => state.users.currentUser,
      backendInteractor: state => state.api.backendInteractor
    }),
    ...mapGetters(['findUser'])
  },
  methods: {
    goBack () {
      this.$emit('cancel')
    },
    goToChat (user) {
      this.$router.push({ name: 'chat', params: { recipient_id: user.id } })
    },
    onInput () {
      this.search(this.query)
    },
    addUser (user) {
      this.selectedUserIds.push(user.id)
      this.query = ''
    },
    removeUser (userId) {
      this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId)
    },
    search (query) {
      if (!query) {
        this.loading = false
        return
      }

      this.loading = true
      this.userIds = []
      this.$store.dispatch('search', { q: query, resolve: true, type: 'accounts' })
        .then(data => {
          this.loading = false
          this.userIds = data.accounts.map(a => a.id)
        })
    }
  }
}

export default chatNew
