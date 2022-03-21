import FollowCard from '../follow_card/follow_card.vue'
import Conversation from '../conversation/conversation.vue'
import Status from '../status/status.vue'
import map from 'lodash/map'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircleNotch,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { uniqBy } from 'lodash'

library.add(
  faCircleNotch,
  faSearch
)

const Search = {
  components: {
    FollowCard,
    Conversation,
    Status
  },
  props: [
    'query'
  ],
  data () {
    return {
      loaded: false,
      loading: false,
      searchTerm: this.query || '',
      userIds: [],
      statuses: [],
      hashtags: [],
      currenResultTab: 'statuses',

      statusesOffset: 0,
      lastStatusFetchCount: 0,
      lastQuery: ''
    }
  },
  computed: {
    users () {
      return this.userIds.map(userId => this.$store.getters.findUser(userId))
    },
    visibleStatuses () {
      const allStatusesObject = this.$store.state.statuses.allStatusesObject

      return this.statuses.filter(status =>
        allStatusesObject[status.id] && !allStatusesObject[status.id].deleted
      )
    }
  },
  mounted () {
    this.search(this.query)
  },
  watch: {
    query (newValue) {
      this.searchTerm = newValue
      this.search(newValue)
    }
  },
  methods: {
    newQuery (query) {
      this.$router.push({ name: 'search', query: { query } })
      this.$refs.searchInput.focus()
    },
    search (query, searchType = null) {
      if (!query) {
        this.loading = false
        return
      }

      this.loading = true
      this.$refs.searchInput.blur()
      if (this.lastQuery !== query) {
        this.userIds = []
        this.hashtags = []
        this.statuses = []

        this.statusesOffset = 0
        this.lastStatusFetchCount = 0
      }

      this.$store.dispatch('search', { q: query, resolve: true, offset: this.statusesOffset, 'type': searchType })
        .then(data => {
          this.loading = false

          let oldLength = this.statuses.length

          // Always append to old results. If new results are empty, this doesn't change anything
          this.userIds = this.userIds.concat(map(data.accounts, 'id'))
          this.statuses = uniqBy(this.statuses.concat(data.statuses), 'id')
          this.hashtags = this.hashtags.concat(data.hashtags)

          this.currenResultTab = this.getActiveTab()
          this.loaded = true

          // Offset from whatever we already have
          this.statusesOffset = this.statuses.length
          // Because the amount of new statuses can actually be zero, compare to old lenght instead
          this.lastStatusFetchCount = this.statuses.length - oldLength
          this.lastQuery = query
        })
    },
    resultCount (tabName) {
      const length = this[tabName].length
      return length === 0 ? '' : ` (${length})`
    },
    onResultTabSwitch (key) {
      this.currenResultTab = key
    },
    getActiveTab () {
      if (this.visibleStatuses.length > 0) {
        return 'statuses'
      } else if (this.users.length > 0) {
        return 'people'
      } else if (this.hashtags.length > 0) {
        return 'hashtags'
      }

      return 'statuses'
    },
    lastHistoryRecord (hashtag) {
      return hashtag.history && hashtag.history[0]
    }
  }
}

export default Search
