import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes,
  faSearch
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faTimes,
  faSearch
)

const SearchBar = {
  data: () => ({
    searchTerm: undefined,
    hidden: true,
    error: false
  }),
  watch: {
    '$route': function (route) {
      if (route.name === 'search') {
        this.searchTerm = route.query.query
      }
    }
  },
  methods: {
    find (searchTerm) {
      this.$router.push({ name: 'search', query: { query: searchTerm } })
      this.$refs.searchInput.focus()
    },
    toggleHidden () {
      this.hidden = !this.hidden
      this.$emit('toggled', this.hidden)
      this.$nextTick(() => {
        if (!this.hidden) {
          this.$refs.searchInput.focus()
        }
      })
    }
  }
}

export default SearchBar
