import FollowCard from '../follow_card/follow_card.vue'
import map from 'lodash/map'

const userSearch = {
  components: {
    FollowCard
  },
  props: [
    'query'
  ],
  data () {
    return {
      username: '',
      userIds: [],
      loading: false
    }
  },
  computed: {
    users () {
      return this.userIds.map(userId => this.$store.getters.findUser(userId))
    }
  },
  mounted () {
    this.search(this.query)
  },
  watch: {
    query (newV) {
      this.search(newV)
    }
  },
  methods: {
    newQuery (query) {
      this.$router.push({ name: 'user-search', query: { query } })
      this.$refs.userSearchInput.focus()
    },
    search (query) {
      if (!query) {
        this.users = []
        return
      }
      this.loading = true
      this.$store.dispatch('searchUsers', query)
        .then((res) => {
          this.loading = false
          this.userIds = map(res, 'id')
        })
    }
  }
}

export default userSearch
