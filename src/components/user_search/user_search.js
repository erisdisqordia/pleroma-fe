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
      users: []
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
    search (query) {
      userSearchApi.search({query, store: this.$store})
        .then((res) => {
          this.users = res
        })
    }
  }
}

export default userSearch
