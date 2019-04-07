import Completion from '../../services/completion/completion.js'
import { take, filter, map } from 'lodash'

const EmojiInput = {
  props: [
    'value',
    'placeholder',
    'type',
    'classname'
  ],
  data () {
    return {
      highlighted: 0,
      caret: 0
    }
  },
  computed: {
    suggestions () {
      const firstchar = this.textAtCaret.charAt(0)
      if (firstchar === ':') {
        if (this.textAtCaret === ':') { return }
        const matchedEmoji = filter(this.emoji.concat(this.customEmoji), (emoji) => emoji.shortcode.startsWith(this.textAtCaret.slice(1)))
        if (matchedEmoji.length <= 0) {
          return false
        }
        // eslint-disable-next-line camelcase
        return map(take(matchedEmoji, 5), ({ shortcode, image_url, utf }, index) => ({
          shortcode: `:${shortcode}:`,
          utf: utf || '',
          // eslint-disable-next-line camelcase
          img: utf ? '' : this.$store.state.instance.server + image_url,
          highlighted: index === this.highlighted
        }))
      } else {
        return false
      }
    },
    textAtCaret () {
      return (this.wordAtCaret || {}).word || ''
    },
    wordAtCaret () {
      const word = Completion.wordAtPosition(this.value, this.caret - 1) || {}
      return word
    },
    emoji () {
      return this.$store.state.instance.emoji || []
    },
    customEmoji () {
      return this.$store.state.instance.customEmoji || []
    }
  },
  methods: {
    replace (replacement) {
      const newValue = Completion.replaceWord(this.value, this.wordAtCaret, replacement)
      this.$emit('input', newValue)
      this.caret = 0
    },
    replaceEmoji (e) {
      const len = this.suggestions.length || 0
      if (this.textAtCaret === ':' || e.ctrlKey) { return }
      if (len > 0) {
        e.preventDefault()
        const emoji = this.suggestions[this.highlighted]
        const replacement = emoji.utf || (emoji.shortcode + ' ')
        const newValue = Completion.replaceWord(this.value, this.wordAtCaret, replacement)
        this.$emit('input', newValue)
        this.caret = 0
        this.highlighted = 0
      }
    },
    cycleBackward (e) {
      const len = this.suggestions.length || 0
      if (len > 0) {
        e.preventDefault()
        this.highlighted -= 1
        if (this.highlighted < 0) {
          this.highlighted = this.suggestions.length - 1
        }
      } else {
        this.highlighted = 0
      }
    },
    cycleForward (e) {
      const len = this.suggestions.length || 0
      if (len > 0) {
        if (e.shiftKey) { return }
        e.preventDefault()
        this.highlighted += 1
        if (this.highlighted >= len) {
          this.highlighted = 0
        }
      } else {
        this.highlighted = 0
      }
    },
    onKeydown (e) {
      e.stopPropagation()
    },
    onInput (e) {
      this.$emit('input', e.target.value)
    },
    setCaret ({ target: { selectionStart } }) {
      this.caret = selectionStart
    }
  }
}

export default EmojiInput
