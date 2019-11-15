import { mapGetters } from 'vuex'

const ReactButton = {
  props: ['status', 'loggedIn'],
  data () {
    return {
      animated: false,
      showTooltip: false,
      popperOptions: {
        modifiers: {
          preventOverflow: { padding: { top: 50 }, boundariesElement: 'viewport' }
        }
      }
    }
  },
  methods: {
    openReactionSelect () {
      console.log('test')
      this.showTooltip = true
    },
    closeReactionSelect () {
      this.showTooltip = false
    },
    favorite () {
      if (!this.status.favorited) {
        this.$store.dispatch('favorite', { id: this.status.id })
      } else {
        this.$store.dispatch('unfavorite', { id: this.status.id })
      }
      this.animated = true
      setTimeout(() => {
        this.animated = false
      }, 500)
    }
  },
  computed: {
    emojis () {
      return this.$store.state.instance.emoji || []
    },
    classes () {
      return {
        'icon-smile': true,
        'animate-spin': this.animated
      }
    },
    ...mapGetters(['mergedConfig'])
  }
}

export default ReactButton
