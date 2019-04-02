import reject from 'lodash/reject'
import BlockCard from '../block_card/block_card.vue'
import userSearchApi from '../../services/new_api/user_search.js'

const debounceMilliseconds = 500

export default {
  components: {
    BlockCard
  },
  data () {
    return {
      query: '',
      results: [],
      timeout: null,
      resultsVisible: false
    }
  },
  watch: {
    query (val) {
      this.fetchResults(val)
    }
  },
  methods: {
    fetchResults (query) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.results = []
        if (query) {
          userSearchApi.search({query, store: this.$store})
            .then((users) => {
              const filteredUsers = reject(users, (user) => {
                return user.statusnet_blocking || user.id === this.$store.state.users.currentUser.id
              })
              this.$store.dispatch('addNewUsers', filteredUsers)
              this.results = filteredUsers
              this.resultsVisible = true
            })
        }
      }, debounceMilliseconds)
    },
    onInputClick () {
      this.resultsVisible = true
    },
    onClickOutside () {
      this.resultsVisible = false
    }
  }
}
