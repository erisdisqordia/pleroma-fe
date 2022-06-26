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

const ListNew = {
  components: {
    BasicUserCard,
    UserAvatar
  },
  data () {
    return {
      title: '',
      userIds: [],
      selectedUserIds: [],
      loading: false,
      query: ''
    }
  },
  created () {
    this.$store.dispatch('fetchList', { id: this.id })
      .then(() => { this.title = this.findListTitle(this.id) })
    this.$store.dispatch('fetchListAccounts', { id: this.id })
      .then(() => {
        this.selectedUserIds = this.findListAccounts(this.id)
        this.selectedUserIds.forEach(userId => {
          this.$store.dispatch('fetchUserIfMissing', userId)
        })
      })
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    users () {
      return this.userIds.map(userId => this.findUser(userId))
    },
    selectedUsers () {
      return this.selectedUserIds.map(userId => this.findUser(userId)).filter(user => user)
    },
    availableUsers () {
      if (this.query.length !== 0) {
        return this.users
      } else {
        return this.selectedUsers
      }
    },
    ...mapState({
      currentUser: state => state.users.currentUser
    }),
    ...mapGetters(['findUser', 'findListTitle', 'findListAccounts'])
  },
  methods: {
    onInput () {
      this.search(this.query)
    },
    selectUser (user) {
      if (this.selectedUserIds.includes(user.id)) {
        this.removeUser(user.id)
      } else {
        this.addUser(user)
      }
    },
    isSelected (user) {
      return this.selectedUserIds.includes(user.id)
    },
    addUser (user) {
      this.selectedUserIds.push(user.id)
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
      this.$store.dispatch('search', { q: query, resolve: true, type: 'accounts', following: true })
        .then(data => {
          this.loading = false
          this.userIds = data.accounts.map(a => a.id)
        })
    },
    updateList () {
      this.$store.dispatch('setList', { id: this.id, title: this.title })
      this.$store.dispatch('setListAccounts', { id: this.id, accountIds: this.selectedUserIds })

      this.$router.push({ name: 'list-timeline', params: { id: this.id } })
    },
    deleteList () {
      this.$store.dispatch('deleteList', { id: this.id })
      this.$router.push({ name: 'lists' })
    }
  }
}

export default ListNew
