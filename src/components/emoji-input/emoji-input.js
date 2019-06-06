import Completion from '../../services/completion/completion.js'
import { take } from 'lodash'

const EmojiInput = {
  props: [
    'placeholder',
    'suggest',
    'value',
    'type',
    'classname'
  ],
  data () {
    return {
      input: undefined,
      highlighted: 0,
      caret: 0
    }
  },
  computed: {
    suggestions () {
      const firstchar = this.textAtCaret.charAt(0)
      if (this.textAtCaret === firstchar) { return }
      const matchedSuggestions = this.suggest(this.textAtCaret)
      if (matchedSuggestions.length <= 0) {
        return false
      }
      return take(matchedSuggestions, 5).map(({shortcode, image_url, replacement}, index) => ({
        shortcode,
        replacement,
        // eslint-disable-next-line camelcase
        img: !image_url ? '' : this.$store.state.instance.server + image_url,
        highlighted: index === this.highlighted
      }))
    },
    textAtCaret () {
      return (this.wordAtCaret || {}).word || ''
    },
    wordAtCaret () {
      if (this.value && this.caret) {
        const word = Completion.wordAtPosition(this.value, this.caret - 1) || {}
        return word
      }
    },
  },
  mounted () {
    const slots = this.$slots.default
    if (slots.length === 0) return
    const input = slots.find(slot => ['input', 'textarea'].includes(slot.tag))
    if (!input) return
    this.input = input
    input.elm.addEventListener('keyup', this.setCaret)
    input.elm.addEventListener('paste', this.setCaret)
    input.elm.addEventListener('focus', this.setCaret)
    input.elm.addEventListener('keydown', this.onKeyDown)
  },
  unmounted () {
    if (this.input) {
      this.input.elm.removeEventListener('keyup', this.setCaret)
      this.input.elm.removeEventListener('paste', this.setCaret)
      this.input.elm.removeEventListener('focus', this.setCaret)
      this.input.elm.removeEventListener('keydown', this.onKeyDown)
    }
  },
  methods: {
    replace (replacement) {
      const newValue = Completion.replaceWord(this.value, this.wordAtCaret, replacement)
      this.$emit('input', newValue)
      this.caret = 0
    },
    replaceText () {
      const len = this.suggestions.length || 0
      if (this.textAtCaret.length === 1) { return }
      if (len > 0) {
        const suggestion = this.suggestions[this.highlighted]
        const replacement = suggestion.replacement
        const newValue = Completion.replaceWord(this.value, this.wordAtCaret, replacement)
        this.$emit('input', newValue)
        this.caret = 0
        this.highlighted = 0
      }
    },
    cycleBackward () {
      const len = this.suggestions.length || 0
      if (len > 0) {
        this.highlighted -= 1
        if (this.highlighted < 0) {
          this.highlighted = this.suggestions.length - 1
        }
      } else {
        this.highlighted = 0
      }
    },
    cycleForward () {
      const len = this.suggestions.length || 0
      if (len > 0) {
        this.highlighted += 1
        if (this.highlighted >= len) {
          this.highlighted = 0
        }
      } else {
        this.highlighted = 0
      }
    },
    onKeyDown (e) {
      this.setCaret(e)
      e.stopPropagation()

      const { ctrlKey, shiftKey, key } = e
      if (key === 'Tab') {
        if (shiftKey) {
          this.cycleBackward()
        } else {
          this.cycleForward()
        }
      }
      if (key === 'ArrowUp') {
        this.cycleBackward()
      } else if (key === 'ArrowDown') {
        this.cycleForward()
      }
      if (key === 'Enter') {
        if (!ctrlKey) {
          this.replaceText()
        }
      }
    },
    onInput (e) {
      this.$emit('input', e.target.value)
    },
    setCaret ({ target: { selectionStart, value } }) {
      this.caret = selectionStart
    }
  }
}

export default EmojiInput
