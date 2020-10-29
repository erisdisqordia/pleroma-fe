import Checkbox from '../checkbox/checkbox.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBoxOpen,
  faStickyNote,
  faSmileBeam
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBoxOpen,
  faStickyNote,
  faSmileBeam
)

// At widest, approximately 20 emoji are visible in a row,
// loading 3 rows, could be overkill for narrow picker
const LOAD_EMOJI_BY = 60

// When to start loading new batch emoji, in pixels
const LOAD_EMOJI_MARGIN = 64

const filterByKeyword = (list, keyword = '') => {
  if (keyword === '') return list

  const keywordLowercase = keyword.toLowerCase()
  let orderedEmojiList = []
  for (const emoji of list) {
    const indexOfKeyword = emoji.displayText.toLowerCase().indexOf(keywordLowercase)
    if (indexOfKeyword > -1) {
      if (!Array.isArray(orderedEmojiList[indexOfKeyword])) {
        orderedEmojiList[indexOfKeyword] = []
      }
      orderedEmojiList[indexOfKeyword].push(emoji)
    }
  }
  return orderedEmojiList.flat()
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
      customEmojiBufferSlice: LOAD_EMOJI_BY,
      customEmojiTimeout: null,
      customEmojiLoadAllConfirmed: false
    }
  },
  components: {
    StickerPicker: () => import('../sticker_picker/sticker_picker.vue'),
    Checkbox
  },
  methods: {
    onStickerUploaded (e) {
      this.$emit('sticker-uploaded', e)
    },
    onStickerUploadFailed (e) {
      this.$emit('sticker-upload-failed', e)
    },
    onEmoji (emoji) {
      const value = emoji.imageUrl ? `:${emoji.displayText}:` : emoji.replacement
      this.$emit('emoji', { insertion: value, keepOpen: this.keepOpen })
    },
    onScroll (e) {
      const target = (e && e.target) || this.$refs['emoji-groups']
      this.updateScrolledClass(target)
      this.scrolledGroup(target)
      this.triggerLoadMore(target)
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
    updateScrolledClass (target) {
      if (target.scrollTop <= 5) {
        this.groupsScrolledClass = 'scrolled-top'
      } else if (target.scrollTop >= target.scrollTopMax - 5) {
        this.groupsScrolledClass = 'scrolled-bottom'
      } else {
        this.groupsScrolledClass = 'scrolled-middle'
      }
    },
    triggerLoadMore (target) {
      const ref = this.$refs['group-end-custom'][0]
      if (!ref) return
      const bottom = ref.offsetTop + ref.offsetHeight

      const scrollerBottom = target.scrollTop + target.clientHeight
      const scrollerTop = target.scrollTop
      const scrollerMax = target.scrollHeight

      // Loads more emoji when they come into view
      const approachingBottom = bottom - scrollerBottom < LOAD_EMOJI_MARGIN
      // Always load when at the very top in case there's no scroll space yet
      const atTop = scrollerTop < 5
      // Don't load when looking at unicode category or at the very bottom
      const bottomAboveViewport = bottom < scrollerTop || scrollerBottom === scrollerMax
      if (!bottomAboveViewport && (approachingBottom || atTop)) {
        this.loadEmoji()
      }
    },
    scrolledGroup (target) {
      const top = target.scrollTop + 5
      this.$nextTick(() => {
        this.emojisView.forEach(group => {
          const ref = this.$refs['group-' + group.id]
          if (ref[0].offsetTop <= top) {
            this.activeGroup = group.id
          }
        })
      })
    },
    loadEmoji () {
      const allLoaded = this.customEmojiBuffer.length === this.filteredEmoji.length

      if (allLoaded) {
        return
      }

      this.customEmojiBufferSlice += LOAD_EMOJI_BY
    },
    startEmojiLoad (forceUpdate = false) {
      if (!forceUpdate) {
        this.keyword = ''
      }
      this.$nextTick(() => {
        this.$refs['emoji-groups'].scrollTop = 0
      })
      const bufferSize = this.customEmojiBuffer.length
      const bufferPrefilledAll = bufferSize === this.filteredEmoji.length
      if (bufferPrefilledAll && !forceUpdate) {
        return
      }
      this.customEmojiBufferSlice = LOAD_EMOJI_BY
    },
    toggleStickers () {
      this.showingStickers = !this.showingStickers
    },
    setShowStickers (value) {
      this.showingStickers = value
    }
  },
  watch: {
    keyword () {
      this.customEmojiLoadAllConfirmed = false
      this.onScroll()
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
    filteredEmoji () {
      return filterByKeyword(
        this.$store.state.instance.customEmoji || [],
        this.keyword
      )
    },
    customEmojiBuffer () {
      return this.filteredEmoji.slice(0, this.customEmojiBufferSlice)
    },
    emojis () {
      const standardEmojis = this.$store.state.instance.emoji || []
      const customEmojis = this.customEmojiBuffer

      return [
        {
          id: 'custom',
          text: this.$t('emoji.custom'),
          icon: 'smile-beam',
          emojis: customEmojis
        },
        {
          id: 'standard',
          text: this.$t('emoji.unicode'),
          icon: 'box-open',
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
