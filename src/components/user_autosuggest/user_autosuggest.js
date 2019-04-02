import { VueAutosuggest } from 'vue-autosuggest'
import BasicUserCard from '../basic_user_card/basic_user_card.vue'
import userSearchApi from '../../services/new_api/user_search.js'

export default {
  components: {
    VueAutosuggest,
    BasicUserCard
  },
  data () {
    return {
      results: [],
      timeout: null,
      selected: null,
      debounceMilliseconds: 500,
      inputProps: {
        id: 'autosuggest__input',
        onInputChange: this.fetchResults,
        placeholder: 'Search...',
        class: 'form-control'
      },
      suggestions: []
    }
  },
  methods: {
    fetchResults (query) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        userSearchApi.search({query, store: this.$store})
          .then((data) => { this.suggestions = [{ data }] })
      }, this.debounceMilliseconds)
    },
    clickHandler (item) {
      return false
    },
    clickUserHandler () {
      console.log('clickUserHandler')
      return false
    }
  }
}
