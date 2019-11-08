import { set } from 'vue'
import Checkbox from '../checkbox/checkbox.vue'

const LOAD_EMOJI_BY = 50
const LOAD_EMOJI_INTERVAL = 100
const LOAD_EMOJI_SANE_AMOUNT = 500

const filterByKeyword = (list, keyword = '') => {
  return list.filter(x => x.displayText.includes(keyword))
}

const EmojiPicker = {
  props: {
    enableStickerPicker: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      keyword: '',
      activeGroup: 'custom',
      showingStickers: false,
      groupsScrolledClass: 'scrolled-top',
      keepOpen: false,
      customEmojiBuffer: (this.$store.state.instance.customEmoji || [])
        .slice(0, LOAD_EMOJI_BY),
      customEmojiTimeout: null,
      customEmojiCounter: LOAD_EMOJI_BY,
      customEmojiLoadAllConfirmed: false
    }
  },
  components: {
    StickerPicker: () => import('../sticker_picker/sticker_picker.vue'),
    Checkbox
  },
  methods: {
    onEmoji (emoji) {
      const value = emoji.imageUrl ? `:${emoji.displayText}:` : emoji.replacement
      this.$emit('emoji', { insertion: value, keepOpen: this.keepOpen })
    },
    highlight (key) {
      const ref = this.$refs['group-' + key]
      const top = ref[0].offsetTop
      this.setShowStickers(false)
      this.activeGroup = key
      this.$nextTick(() => {
        this.$refs['emoji-groups'].scrollTop = top + 1
      })
    },
    scrolledGroup (e) {
      const target = (e && e.target) || this.$refs['emoji-groups']
      const top = target.scrollTop + 5
      if (target.scrollTop <= 5) {
        this.groupsScrolledClass = 'scrolled-top'
      } else if (target.scrollTop >= target.scrollTopMax - 5) {
        this.groupsScrolledClass = 'scrolled-bottom'
      } else {
        this.groupsScrolledClass = 'scrolled-middle'
      }
      this.$nextTick(() => {
        this.emojisView.forEach(group => {
          const ref = this.$refs['group-' + group.id]
          if (ref[0].offsetTop <= top) {
            this.activeGroup = group.id
          }
        })
      })
    },
    loadEmojiInsane () {
      this.customEmojiLoadAllConfirmed = true
      this.continueEmojiLoad()
    },
    loadEmoji () {
      const allLoaded = this.customEmojiBuffer.length === this.filteredEmoji.length
      const saneLoaded = this.customEmojiBuffer.length >= LOAD_EMOJI_SANE_AMOUNT &&
            !this.customEmojiLoadAllConfirmed

      if (allLoaded || saneLoaded) {
        return
      }

      this.customEmojiBuffer.push(
        ...this.filteredEmoji.slice(
          this.customEmojiCounter,
          this.customEmojiCounter + LOAD_EMOJI_BY
        )
      )
      this.customEmojiTimeout = window.setTimeout(this.loadEmoji, LOAD_EMOJI_INTERVAL)
      this.customEmojiCounter += LOAD_EMOJI_BY
    },
    startEmojiLoad (forceUpdate = false) {
      const bufferSize = this.customEmojiBuffer.length
      const bufferPrefilledSane = bufferSize === LOAD_EMOJI_SANE_AMOUNT && !this.customEmojiLoadAllConfirmed
      const bufferPrefilledAll = bufferSize === this.filteredEmoji.length
      if (forceUpdate || bufferPrefilledSane || bufferPrefilledAll) {
        return
      }
      if (this.customEmojiTimeout) {
        window.clearTimeout(this.customEmojiTimeout)
      }

      set(
        this,
        'customEmojiBuffer',
        this.filteredEmoji.slice(0, LOAD_EMOJI_BY)
      )
      this.customEmojiCounter = LOAD_EMOJI_BY
      this.customEmojiTimeout = window.setTimeout(this.loadEmoji, LOAD_EMOJI_INTERVAL)
    },
    continueEmojiLoad () {
      this.customEmojiTimeout = window.setTimeout(this.loadEmoji, LOAD_EMOJI_INTERVAL)
    },
    toggleStickers () {
      this.showingStickers = !this.showingStickers
    },
    setShowStickers (value) {
      this.showingStickers = value
    },
    onStickerUploaded (e) {
      this.$emit('sticker-uploaded', e)
    },
    onStickerUploadFailed (e) {
      this.$emit('sticker-upload-failed', e)
    }
  },
  watch: {
    keyword () {
      this.customEmojiLoadAllConfirmed = false
      this.scrolledGroup()
      this.startEmojiLoad(true)
    }
  },
  computed: {
    activeGroupView () {
      return this.showingStickers ? '' : this.activeGroup
    },
    stickersAvailable () {
      if (this.$store.state.instance.stickers) {
        return this.$store.state.instance.stickers.length > 0
      }
      return 0
    },
    saneAmount () {
      // for UI
      return LOAD_EMOJI_SANE_AMOUNT
    },
    filteredEmoji () {
      return filterByKeyword(
        this.$store.state.instance.customEmoji || [],
        this.keyword
      )
    },
    askForSanity () {
      return this.customEmojiBuffer.length >= LOAD_EMOJI_SANE_AMOUNT &&
        !this.customEmojiLoadAllConfirmed
    },
    emojis () {
      const standardEmojis = this.$store.state.instance.emoji || []
      const customEmojis = this.customEmojiBuffer

      return [
        {
          id: 'custom',
          text: this.$t('emoji.custom'),
          icon: 'icon-smile',
          emojis: customEmojis
        },
        {
          id: 'standard',
          text: this.$t('emoji.unicode'),
          icon: 'icon-picture',
          emojis: filterByKeyword(standardEmojis, this.keyword)
        }
      ]
    },
    emojisView () {
      return this.emojis.filter(value => value.emojis.length > 0)
    },
    stickerPickerEnabled () {
      return (this.$store.state.instance.stickers || []).length !== 0
    }
  }
}

export default EmojiPicker
