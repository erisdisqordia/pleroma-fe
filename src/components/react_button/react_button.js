import Popover from '../popover/popover.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSmileBeam } from '@fortawesome/free-regular-svg-icons'

library.add(faSmileBeam)

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
    },
    focusInput () {
      this.$nextTick(() => {
        const input = this.$el.querySelector('input')
        if (input) input.focus()
      })
    }
  },
  computed: {
    commonEmojis () {
      return [
        { displayText: 'thumbsup', replacement: '👍' },
        { displayText: 'angry', replacement: '😠' },
        { displayText: 'eyes', replacement: '👀' },
        { displayText: 'joy', replacement: '😂' },
        { displayText: 'fire', replacement: '🔥' }
      ]
    },
    emojis () {
      if (this.filterWord !== '') {
        const filterWordLowercase = this.filterWord.toLowerCase()
        let orderedEmojiList = []
        for (const emoji of this.$store.state.instance.emoji) {
          if (emoji.replacement === this.filterWord) return [emoji]

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
    mergedConfig () {
      return this.$store.getters.mergedConfig
    }
  }
}

export default ReactButton
