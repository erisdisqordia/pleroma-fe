import { mapGetters } from 'vuex'

const ReactButton = {
  props: ['status', 'loggedIn'],
  data () {
    return {
      showTooltip: false,
      filterWord: '',
      popperOptions: {
        modifiers: {
          preventOverflow: { padding: { top: 50 }, boundariesElement: 'viewport' }
        }
      }
    }
  },
  methods: {
    openReactionSelect () {
      this.showTooltip = true
      this.filterWord = ''
    },
    closeReactionSelect () {
      this.showTooltip = false
    },
    addReaction (event, emoji) {
      this.$store.dispatch('reactWithEmoji', { id: this.status.id, emoji })
      this.closeReactionSelect()
    }
  },
  computed: {
    commonEmojis () {
      return ['❤️', '😠', '👀', '😂', '🔥']
    },
    emojis () {
      if (this.filterWord !== '') {
        return this.$store.state.instance.emoji.filter(emoji => emoji.displayText.includes(this.filterWord))
      }
      return this.$store.state.instance.emoji || []
    },
    ...mapGetters(['mergedConfig'])
  }
}

export default ReactButton
