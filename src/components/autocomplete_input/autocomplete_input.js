import Completion from '../../services/completion/completion.js'
import { take, filter, map } from 'lodash'

const AutoCompleteInput = {
  props: [
    'id',
    'classObj',
    'value',
    'placeholder',
    'autoResize',
    'multiline',
    'drop',
    'dragoverPrevent',
    'paste',
    'keydownMetaEnter',
    'keyupCtrlEnter'
  ],
  components: {},
  mounted () {
    this.autoResize && this.resize(this.$refs.textarea)
    const textLength = this.$refs.textarea.value.length
    this.$refs.textarea.setSelectionRange(textLength, textLength)
  },
  data () {
    return {
      caret: 0,
      highlighted: 0,
      text: this.value
    }
  },
  computed: {
    users () {
      return this.$store.state.users.users
    },
    emoji () {
      return this.$store.state.instance.emoji || []
    },
    customEmoji () {
      return this.$store.state.instance.customEmoji || []
    },
    textAtCaret () {
      return (this.wordAtCaret || {}).word || ''
    },
    wordAtCaret () {
      const word = Completion.wordAtPosition(this.text, this.caret - 1) || {}
      return word
    },
    candidates () {
      const firstchar = this.textAtCaret.charAt(0)
      if (firstchar === '@') {
        const query = this.textAtCaret.slice(1).toUpperCase()
        const matchedUsers = filter(this.users, (user) => {
          return user.screen_name.toUpperCase().startsWith(query) ||
            user.name && user.name.toUpperCase().startsWith(query)
        })
        if (matchedUsers.length <= 0) {
          return false
        }
        // eslint-disable-next-line camelcase
        return map(take(matchedUsers, 5), ({screen_name, name, profile_image_url_original}, index) => ({
          // eslint-disable-next-line camelcase
          screen_name: `@${screen_name}`,
          name: name,
          img: profile_image_url_original,
          highlighted: index === this.highlighted
        }))
      } else if (firstchar === ':') {
        if (this.textAtCaret === ':') { return }
        const matchedEmoji = filter(this.emoji.concat(this.customEmoji), (emoji) => emoji.shortcode.startsWith(this.textAtCaret.slice(1)))
        if (matchedEmoji.length <= 0) {
          return false
        }
        return map(take(matchedEmoji, 5), ({shortcode, image_url, utf}, index) => ({
          screen_name: `:${shortcode}:`,
          name: '',
          utf: utf || '',
          // eslint-disable-next-line camelcase
          img: utf ? '' : this.$store.state.instance.server + image_url,
          highlighted: index === this.highlighted
        }))
      } else {
        return false
      }
    }
  },
  methods: {
    setCaret ({target: {selectionStart}}) {
      this.caret = selectionStart
    },
    cycleBackward (e) {
      const len = this.candidates.length || 0
      if (len > 0) {
        e.preventDefault()
        this.highlighted -= 1
        if (this.highlighted < 0) {
          this.highlighted = this.candidates.length - 1
        }
      } else {
        this.highlighted = 0
      }
    },
    cycleForward (e) {
      const len = this.candidates.length || 0
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
    replace (replacement) {
      this.text = Completion.replaceWord(this.text, this.wordAtCaret, replacement)
      const el = this.$el.querySelector('textarea')
      el.focus()
      this.caret = 0
    },
    replaceCandidate (e) {
      const len = this.candidates.length || 0
      if (this.textAtCaret === ':' || e.ctrlKey) { return }
      if (len > 0) {
        e.preventDefault()
        const candidate = this.candidates[this.highlighted]
        const replacement = candidate.utf || (candidate.screen_name + ' ')
        this.text = Completion.replaceWord(this.text, this.wordAtCaret, replacement)
        const el = this.$el.querySelector('textarea')
        el.focus()
        this.caret = 0
        this.highlighted = 0
      }
    },
    resize (e) {
      const target = e.target || e
      if (!(target instanceof window.Element)) { return }
      const vertPadding = Number(window.getComputedStyle(target)['padding-top'].substr(0, 1)) +
            Number(window.getComputedStyle(target)['padding-bottom'].substr(0, 1))
      // Auto is needed to make textbox shrink when removing lines
      target.style.height = 'auto'
      target.style.height = `${target.scrollHeight - vertPadding}px`
      if (target.value === '') {
        target.style.height = null
      }
    }
  }
}

export default AutoCompleteInput
