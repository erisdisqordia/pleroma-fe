import UserCard from '../user_card/user_card.vue'
import userSearchApi from '../../services/new_api/user_search.js'
const userSearch = {
  components: {
    UserCard
  },
  props: [
    'query'
  ],
  data () {
    return {
      username: '',
      users: [],
      loading: false
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
    },
    search (query) {
      if (!query) {
        this.users = []
        return
      }
      this.loading = true
      userSearchApi.search({query, store: this.$store})
        .then((res) => {
          this.loading = false
          this.users = res
        })
    }
  }
}

export default userSearch
