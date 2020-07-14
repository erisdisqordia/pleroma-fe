import Popover from '../popover/popover.vue'
import { mapGetters } from 'vuex'

const ReactButton = {
  props: ['status'],
  data () {
    return {
      filterWord: ''
    }
  },
  components: {
    Popover
  },
  methods: {
    addReaction (event, emoji, close) {
      const existingReaction = this.status.emoji_reactions.find(r => r.name === emoji)
      if (existingReaction && existingReaction.me) {
        this.$store.dispatch('unreactWithEmoji', { id: this.status.id, emoji })
      } else {
        this.$store.dispatch('reactWithEmoji', { id: this.status.id, emoji })
      }
      close()
    }
  },
  computed: {
    commonEmojis () {
      return ['👍', '😠', '👀', '😂', '🔥']
    },
    emojis () {
      if (this.filterWord !== '') {
        const filterWordLowercase = this.filterWord.toLowerCase()
        return this.$store.state.instance.emoji.filter(emoji =>
          emoji.displayText.toLowerCase().includes(filterWordLowercase)
        )
      }
      return this.$store.state.instance.emoji || []
    },
    ...mapGetters(['mergedConfig'])
  }
}

export default ReactButton
