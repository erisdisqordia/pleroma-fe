import UserCard from '../user_card/user_card.vue'

const FriendsList = {
  data () {
    return {
      loading: false,
      bottomedOut: false,
      error: false
    }
  },
  props: ['userId'],
  created () {
    window.addEventListener('scroll', this.scrollLoad)
    if (this.user.followers.length === 0) {
      this.fetchFriends()
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
    friends () {
      return this.user.friends
    }
  },
  methods: {
    fetchFriends () {
      if (!this.loading) {
        this.loading = true
        this.$store.dispatch('addFriends', this.userId).then(friends => {
          this.error = false
          this.loading = false
          this.bottomedOut = friends.length === 0
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
        this.fetchFriends()
      }
    }
  },
  components: {
    UserCard
  }
}

export default FriendsList
