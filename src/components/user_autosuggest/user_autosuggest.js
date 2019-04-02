const debounceMilliseconds = 500

export default {
  props: {
    query: {    // function to query results and return a promise
      type: Function,
      required: true
    },
    filter: {   // function to filter results in real time
      type: Function
    },
    placeholder: {
      type: String,
      default: 'Search...'
    }
  },
  data () {
    return {
      term: '',
      timeout: null,
      results: [],
      resultsVisible: false
    }
  },
  computed: {
    filtered () {
      return this.filter ? this.filter(this.results) : this.results
    }
  },
  watch: {
    term (val) {
      this.fetchResults(val)
    }
  },
  methods: {
    fetchResults (term) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.results = []
        if (term) {
          this.query(term).then((results) => { this.results = results })
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
