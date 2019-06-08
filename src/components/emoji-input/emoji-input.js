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
      caret: 0,
      focused: false,
      popupOptions: {
        placement: 'bottom-start',
        trigger: 'hover',
        // See: https://github.com/RobinCK/vue-popper/issues/63
        'delay-on-mouse-over': 9999999,
        'delay-on-mouse-out': 9999999,
        modifiers: {
          arrow: { enabled: true },
          offset: { offset: '0, 5px' }
        }
      }
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
      return take(matchedSuggestions, 5)
        .map(({ imageUrl, ...rest }, index) => ({
          ...rest,
          // eslint-disable-next-line camelcase
          img: imageUrl || '',
          highlighted: index === this.highlighted
        }))
    },
    showPopup () {
      return this.focused && this.suggestions && this.suggestions.length > 0
    },
    textAtCaret () {
      return (this.wordAtCaret || {}).word || ''
    },
    wordAtCaret () {
      if (this.value && this.caret) {
        const word = Completion.wordAtPosition(this.value, this.caret - 1) || {}
        return word
      }
    }
  },
  mounted () {
    const slots = this.$slots.default
    if (!slots || slots.length === 0) return
    const input = slots.find(slot => ['input', 'textarea'].includes(slot.tag))
    if (!input) return
    this.input = input
    this.resize()
    input.elm.addEventListener('blur', this.onBlur)
    input.elm.addEventListener('focus', this.onFocus)
    input.elm.addEventListener('paste', this.onPaste)
    input.elm.addEventListener('keyup', this.onKeyUp)
    input.elm.addEventListener('keydown', this.onKeyDown)
  },
  unmounted () {
    const { input } = this
    if (input) {
      input.elm.removeEventListener('blur', this.onBlur)
      input.elm.removeEventListener('focus', this.onFocus)
      input.elm.removeEventListener('paste', this.onPaste)
      input.elm.removeEventListener('keyup', this.onKeyUp)
      input.elm.removeEventListener('keydown', this.onKeyDown)
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
    onBlur (e) {
      this.focused = false
      this.setCaret(e)
      this.resize(e)
    },
    onFocus (e) {
      this.focused = true
      this.setCaret(e)
      this.resize(e)
    },
    onKeyUp (e) {
      this.setCaret(e)
      this.resize(e)
    },
    onPaste (e) {
      this.setCaret(e)
      this.resize(e)
    },
    onKeyDown (e) {
      this.setCaret(e)
      this.resize(e)

      const { ctrlKey, shiftKey, key } = e
      if (key === 'Tab') {
        if (shiftKey) {
          this.cycleBackward()
          e.preventDefault()
        } else {
          this.cycleForward()
          e.preventDefault()
        }
      }
      if (key === 'ArrowUp') {
        this.cycleBackward()
        e.preventDefault()
      } else if (key === 'ArrowDown') {
        this.cycleForward()
        e.preventDefault()
      }
      if (key === 'Enter') {
        if (!ctrlKey) {
          this.replaceText()
          e.preventDefault()
        }
      }
    },
    onInput (e) {
      this.$emit('input', e.target.value)
    },
    setCaret ({ target: { selectionStart, value } }) {
      this.caret = selectionStart
    },
    resize () {
      const { panel } = this.$refs
      if (!panel) return
      const { offsetHeight, offsetTop } = this.input.elm
      this.$refs.panel.style.top = (offsetTop + offsetHeight) + 'px'
    }
  }
}

export default EmojiInput
