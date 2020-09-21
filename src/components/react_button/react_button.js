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
        let orderedEmojiList = []
        for (const emoji of this.$store.state.instance.emoji) {
          const indexOfFilterWord = emoji.displayText.toLowerCase().indexOf(filterWordLowercase)
          if (indexOfFilterWord > -1) {
            if (!Array.isArray(orderedEmojiList[indexOfFilterWord])) {
              orderedEmojiList[indexOfFilterWord] = []
            }
            orderedEmojiList[indexOfFilterWord].push(emoji)
          }
        }
        return orderedEmojiList.flat()
      }
      return this.$store.state.instance.emoji || []
    },
    ...mapGetters(['mergedConfig'])
  }
}

export default ReactButton
