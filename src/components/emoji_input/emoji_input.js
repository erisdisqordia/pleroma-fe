import Completion from '../../services/completion/completion.js'
import EmojiPicker from '../emoji_picker/emoji_picker.vue'
import { take } from 'lodash'
import { findOffset } from '../../services/offset_finder/offset_finder.service.js'

/**
 * EmojiInput - augmented inputs for emoji and autocomplete support in inputs
 * without having to give up the comfort of <input/> and <textarea/> elements
 *
 * Intended usage is:
 * <EmojiInput v-model="something">
 *   <input v-model="something"/>
 * </EmojiInput>
 *
 * Works only with <input> and <textarea>. Intended to use with only one nested
 * input. It will find first input or textarea and work with that, multiple
 * nested children not tested. You HAVE TO duplicate v-model for both
 * <emoji-input> and <input>/<textarea> otherwise it will not work.
 *
 * Be prepared for CSS troubles though because it still wraps component in a div
 * while TRYING to make it look like nothing happened, but it could break stuff.
 */

const EmojiInput = {
  props: {
    suggest: {
      /**
       * suggest: function (input: String) => Suggestion[]
       *
       * Function that takes input string which takes string (textAtCaret)
       * and returns an array of Suggestions
       *
       * Suggestion is an object containing following properties:
       * displayText: string. Main display text, what actual suggestion
       *    represents (user's screen name/emoji shortcode)
       * replacement: string. Text that should replace the textAtCaret
       * detailText: string, optional. Subtitle text, providing additional info
       *    if present (user's nickname)
       * imageUrl: string, optional. Image to display alongside with suggestion,
       *    currently if no image is provided, replacement will be used (for
       *    unicode emojis)
       *
       * TODO: make it asynchronous when adding proper server-provided user
       * suggestions
       *
       * For commonly used suggestors (emoji, users, both) use suggestor.js
       */
      required: true,
      type: Function
    },
    value: {
      /**
       * Used for v-model
       */
      required: true,
      type: String
    },
    enableEmojiPicker: {
      /**
       * Enables emoji picker support, this implies that custom emoji are supported
       */
      required: false,
      type: Boolean,
      default: false
    },
    hideEmojiButton: {
      /**
       * intended to use with external picker trigger, i.e. you have a button outside
       * input that will open up the picker, see triggerShowPicker()
       */
      required: false,
      type: Boolean,
      default: false
    },
    enableStickerPicker: {
      /**
       * Enables sticker picker support, only makes sense when enableEmojiPicker=true
       */
      required: false,
      type: Boolean,
      default: false
    },
    placement: {
      /**
       * Forces the panel to take a specific position relative to the input element.
       * The 'auto' placement chooses either bottom or top depending on which has the available space (when both have available space, bottom is preferred).
       */
      required: false,
      type: String, // 'auto', 'top', 'bottom'
      default: 'auto'
    },
    newlineOnCtrlEnter: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      input: undefined,
      highlighted: 0,
      caret: 0,
      focused: false,
      blurTimeout: null,
      showPicker: false,
      temporarilyHideSuggestions: false,
      keepOpen: false,
      disableClickOutside: false
    }
  },
  components: {
    EmojiPicker
  },
  computed: {
    padEmoji () {
      return this.$store.getters.mergedConfig.padEmoji
    },
    suggestions () {
      const firstchar = this.textAtCaret.charAt(0)
      if (this.textAtCaret === firstchar) { return [] }
      const matchedSuggestions = this.suggest(this.textAtCaret)
      if (matchedSuggestions.length <= 0) {
        return []
      }
      return take(matchedSuggestions, 5)
        .map(({ imageUrl, ...rest }, index) => ({
          ...rest,
          // eslint-disable-next-line camelcase
          img: imageUrl || '',
          highlighted: index === this.highlighted
        }))
    },
    showSuggestions () {
      return this.focused &&
        this.suggestions &&
        this.suggestions.length > 0 &&
        !this.showPicker &&
        !this.temporarilyHideSuggestions
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
    input.elm.addEventListener('click', this.onClickInput)
    input.elm.addEventListener('transitionend', this.onTransition)
    input.elm.addEventListener('input', this.onInput)
  },
  unmounted () {
    const { input } = this
    if (input) {
      input.elm.removeEventListener('blur', this.onBlur)
      input.elm.removeEventListener('focus', this.onFocus)
      input.elm.removeEventListener('paste', this.onPaste)
      input.elm.removeEventListener('keyup', this.onKeyUp)
      input.elm.removeEventListener('keydown', this.onKeyDown)
      input.elm.removeEventListener('click', this.onClickInput)
      input.elm.removeEventListener('transitionend', this.onTransition)
      input.elm.removeEventListener('input', this.onInput)
    }
  },
  watch: {
    showSuggestions: function (newValue) {
      this.$emit('shown', newValue)
    }
  },
  methods: {
    triggerShowPicker () {
      this.showPicker = true
      this.$refs.picker.startEmojiLoad()
      this.$nextTick(() => {
        this.scrollIntoView()
      })
      // This temporarily disables "click outside" handler
      // since external trigger also means click originates
      // from outside, thus preventing picker from opening
      this.disableClickOutside = true
      setTimeout(() => {
        this.disableClickOutside = false
      }, 0)
    },
    togglePicker () {
      this.input.elm.focus()
      this.showPicker = !this.showPicker
      if (this.showPicker) {
        this.scrollIntoView()
        this.$refs.picker.startEmojiLoad()
      }
    },
    replace (replacement) {
      const newValue = Completion.replaceWord(this.value, this.wordAtCaret, replacement)
      this.$emit('input', newValue)
      this.caret = 0
    },
    insert ({ insertion, keepOpen, surroundingSpace = true }) {
      const before = this.value.substring(0, this.caret) || ''
      const after = this.value.substring(this.caret) || ''

      /* Using a bit more smart approach to padding emojis with spaces:
       * - put a space before cursor if there isn't one already, unless we
       *   are at the beginning of post or in spam mode
       * - put a space after emoji if there isn't one already unless we are
       *   in spam mode
       *
       * The idea is that when you put a cursor somewhere in between sentence
       * inserting just ' :emoji: ' will add more spaces to post which might
       * break the flow/spacing, as well as the case where user ends sentence
       * with a space before adding emoji.
       *
       * Spam mode is intended for creating multi-part emojis and overall spamming
       * them, masto seem to be rendering :emoji::emoji: correctly now so why not
       */
      const isSpaceRegex = /\s/
      const spaceBefore = (surroundingSpace && !isSpaceRegex.exec(before.slice(-1)) && before.length && this.padEmoji > 0) ? ' ' : ''
      const spaceAfter = (surroundingSpace && !isSpaceRegex.exec(after[0]) && this.padEmoji) ? ' ' : ''

      const newValue = [
        before,
        spaceBefore,
        insertion,
        spaceAfter,
        after
      ].join('')
      this.keepOpen = keepOpen
      this.$emit('input', newValue)
      const position = this.caret + (insertion + spaceAfter + spaceBefore).length
      if (!keepOpen) {
        this.input.elm.focus()
      }

      this.$nextTick(function () {
        // Re-focus inputbox after clicking suggestion
        // Set selection right after the replacement instead of the very end
        this.input.elm.setSelectionRange(position, position)
        this.caret = position
      })
    },
    replaceText (e, suggestion) {
      const len = this.suggestions.length || 0
      if (this.textAtCaret.length === 1) { return }
      if (len > 0 || suggestion) {
        const chosenSuggestion = suggestion || this.suggestions[this.highlighted]
        const replacement = chosenSuggestion.replacement
        const newValue = Completion.replaceWord(this.value, this.wordAtCaret, replacement)
        this.$emit('input', newValue)
        this.highlighted = 0
        const position = this.wordAtCaret.start + replacement.length

        this.$nextTick(function () {
          // Re-focus inputbox after clicking suggestion
          this.input.elm.focus()
          // Set selection right after the replacement instead of the very end
          this.input.elm.setSelectionRange(position, position)
          this.caret = position
        })
        e.preventDefault()
      }
    },
    cycleBackward (e) {
      const len = this.suggestions.length || 0
      if (len > 1) {
        this.highlighted -= 1
        if (this.highlighted < 0) {
          this.highlighted = this.suggestions.length - 1
        }
        e.preventDefault()
      } else {
        this.highlighted = 0
      }
    },
    cycleForward (e) {
      const len = this.suggestions.length || 0
      if (len > 1) {
        this.highlighted += 1
        if (this.highlighted >= len) {
          this.highlighted = 0
        }
        e.preventDefault()
      } else {
        this.highlighted = 0
      }
    },
    scrollIntoView () {
      const rootRef = this.$refs['picker'].$el
      /* Scroller is either `window` (replies in TL), sidebar (main post form,
       * replies in notifs) or mobile post form. Note that getting and setting
       * scroll is different for `Window` and `Element`s
       */
      const scrollerRef = this.$el.closest('.sidebar-scroller') ||
            this.$el.closest('.post-form-modal-view') ||
            window
      const currentScroll = scrollerRef === window
        ? scrollerRef.scrollY
        : scrollerRef.scrollTop
      const scrollerHeight = scrollerRef === window
        ? scrollerRef.innerHeight
        : scrollerRef.offsetHeight

      const scrollerBottomBorder = currentScroll + scrollerHeight
      // We check where the bottom border of root element is, this uses findOffset
      // to find offset relative to scrollable container (scroller)
      const rootBottomBorder = rootRef.offsetHeight + findOffset(rootRef, scrollerRef).top

      const bottomDelta = Math.max(0, rootBottomBorder - scrollerBottomBorder)
      // could also check top delta but there's no case for it
      const targetScroll = currentScroll + bottomDelta

      if (scrollerRef === window) {
        scrollerRef.scroll(0, targetScroll)
      } else {
        scrollerRef.scrollTop = targetScroll
      }

      this.$nextTick(() => {
        const { offsetHeight } = this.input.elm
        const { picker } = this.$refs
        const pickerBottom = picker.$el.getBoundingClientRect().bottom
        if (pickerBottom > window.innerHeight) {
          picker.$el.style.top = 'auto'
          picker.$el.style.bottom = offsetHeight + 'px'
        }
      })
    },
    onTransition (e) {
      this.resize()
    },
    onBlur (e) {
      // Clicking on any suggestion removes focus from autocomplete,
      // preventing click handler ever executing.
      this.blurTimeout = setTimeout(() => {
        this.focused = false
        this.setCaret(e)
        this.resize()
      }, 200)
    },
    onClick (e, suggestion) {
      this.replaceText(e, suggestion)
    },
    onFocus (e) {
      if (this.blurTimeout) {
        clearTimeout(this.blurTimeout)
        this.blurTimeout = null
      }

      if (!this.keepOpen) {
        this.showPicker = false
      }
      this.focused = true
      this.setCaret(e)
      this.resize()
      this.temporarilyHideSuggestions = false
    },
    onKeyUp (e) {
      const { key } = e
      this.setCaret(e)
      this.resize()

      // Setting hider in keyUp to prevent suggestions from blinking
      // when moving away from suggested spot
      if (key === 'Escape') {
        this.temporarilyHideSuggestions = true
      } else {
        this.temporarilyHideSuggestions = false
      }
    },
    onPaste (e) {
      this.setCaret(e)
      this.resize()
    },
    onKeyDown (e) {
      const { ctrlKey, shiftKey, key } = e
      if (this.newlineOnCtrlEnter && ctrlKey && key === 'Enter') {
        this.insert({ insertion: '\n', surroundingSpace: false })
        // Ensure only one new line is added on macos
        e.stopPropagation()
        e.preventDefault()

        // Scroll the input element to the position of the cursor
        this.$nextTick(() => {
          this.input.elm.blur()
          this.input.elm.focus()
        })
      }
      // Disable suggestions hotkeys if suggestions are hidden
      if (!this.temporarilyHideSuggestions) {
        if (key === 'Tab') {
          if (shiftKey) {
            this.cycleBackward(e)
          } else {
            this.cycleForward(e)
          }
        }
        if (key === 'ArrowUp') {
          this.cycleBackward(e)
        } else if (key === 'ArrowDown') {
          this.cycleForward(e)
        }
        if (key === 'Enter') {
          if (!ctrlKey) {
            this.replaceText(e)
          }
        }
      }
      // Probably add optional keyboard controls for emoji picker?

      // Escape hides suggestions, if suggestions are hidden it
      // de-focuses the element (i.e. default browser behavior)
      if (key === 'Escape') {
        if (!this.temporarilyHideSuggestions) {
          this.input.elm.focus()
        }
      }

      this.showPicker = false
      this.resize()
    },
    onInput (e) {
      this.showPicker = false
      this.setCaret(e)
      this.resize()
      this.$emit('input', e.target.value)
    },
    onClickInput (e) {
      this.showPicker = false
    },
    onClickOutside (e) {
      if (this.disableClickOutside) return
      this.showPicker = false
    },
    onStickerUploaded (e) {
      this.showPicker = false
      this.$emit('sticker-uploaded', e)
    },
    onStickerUploadFailed (e) {
      this.showPicker = false
      this.$emit('sticker-upload-Failed', e)
    },
    setCaret ({ target: { selectionStart } }) {
      this.caret = selectionStart
    },
    resize () {
      const panel = this.$refs.panel
      if (!panel) return
      const picker = this.$refs.picker.$el
      const panelBody = this.$refs['panel-body']
      const { offsetHeight, offsetTop } = this.input.elm
      const offsetBottom = offsetTop + offsetHeight

      this.setPlacement(panelBody, panel, offsetBottom)
      this.setPlacement(picker, picker, offsetBottom)
    },
    setPlacement (container, target, offsetBottom) {
      if (!container || !target) return

      target.style.top = offsetBottom + 'px'
      target.style.bottom = 'auto'

      if (this.placement === 'top' || (this.placement === 'auto' && this.overflowsBottom(container))) {
        target.style.top = 'auto'
        target.style.bottom = this.input.elm.offsetHeight + 'px'
      }
    },
    overflowsBottom (el) {
      return el.getBoundingClientRect().bottom > window.innerHeight
    }
  }
}

export default EmojiInput
