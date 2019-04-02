import reject from 'lodash/reject'
import map from 'lodash/map'
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
  computed: {
    filtered () {
      return reject(this.results, (userId) => {
        const user = this.$store.getters.findUser(userId)
        return !user || user.statusnet_blocking || user.id === this.$store.state.users.currentUser.id
      })
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
              this.$store.dispatch('addNewUsers', users)
              this.results = map(users, 'id')
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
