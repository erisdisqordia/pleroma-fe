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
            .then((data) => {
              this.$store.dispatch('addNewUsers', data)
              this.results = data
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
