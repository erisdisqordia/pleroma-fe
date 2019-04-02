import BasicUserCard from '../basic_user_card/basic_user_card.vue'
import userSearchApi from '../../services/new_api/user_search.js'

const debounceMilliseconds = 500

export default {
  components: {
    BasicUserCard
  },
  data () {
    return {
      query: '',
      results: [],
      timeout: null
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
            .then((data) => { this.results = data })
        }
      }, debounceMilliseconds)
    }
  }
}
