import UserCard from '../user_card/user_card.vue'

const FollowList = {
  data () {
    return {
      loading: false,
      bottomedOut: false,
      error: false
    }
  },
  props: ['userId', 'showFollowers'],
  created () {
    window.addEventListener('scroll', this.scrollLoad)
    if (this.entries.length === 0) {
      this.fetchEntries()
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollLoad)
    this.$store.dispatch('clearFriendsAndFollowers', this.userId)
  },
  computed: {
    user () {
      return this.$store.getters.userById(this.userId)
    },
    entries () {
      return this.showFollowers ? this.user.followers : this.user.friends
    }
  },
  methods: {
    fetchEntries () {
      if (!this.loading) {
        const command = this.showFollowers ? 'addFollowers' : 'addFriends'
        this.loading = true
        this.$store.dispatch(command, this.userId).then(entries => {
          this.error = false
          this.loading = false
          this.bottomedOut = entries.length === 0
        }).catch(() => {
          this.error = true
          this.loading = false
        })
      }
    },
    scrollLoad (e) {
      const bodyBRect = document.body.getBoundingClientRect()
      const height = Math.max(bodyBRect.height, -(bodyBRect.y))
      if (this.loading === false &&
        this.bottomedOut === false &&
        this.$el.offsetHeight > 0 &&
        (window.innerHeight + window.pageYOffset) >= (height - 750)
      ) {
        this.fetchEntries()
      }
    }
  },
  components: {
    UserCard
  }
}

export default FollowList
