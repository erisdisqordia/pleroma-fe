import { set } from 'vue'

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
      labelKey: String(Math.random() * 100000),
      keyword: '',
      activeGroup: 'custom',
      showingStickers: false,
      groupsScrolledClass: 'scrolled-top',
      keepOpen: false,
      customEmojiBuffer: [],
      customEmojiInterval: null,
      customEmojiCounter: 0
    }
  },
  components: {
    StickerPicker: () => import('../sticker_picker/sticker_picker.vue')
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
    restartInterval () {
      const customEmojis = filterByKeyword(
        this.$store.state.instance.customEmoji || [],
        this.keyword
      )
      const amount = 50
      const interval = 100

      if (this.customEmojiInterval) {
        window.clearInterval(this.customEmojiInterval)
      }
      window.setTimeout(
        window.clearInterval(this.customEmojiInterval),
        1000
      )
      set(this, 'customEmojiBuffer', [])
      this.customEmojiCounter = 0
      this.customEmojiInterval = window.setInterval(() => {
        console.log(this.customEmojiBuffer.length)
        console.log(customEmojis.length)
        if (this.customEmojiBuffer.length < customEmojis.length) {
          this.customEmojiBuffer.push(
            ...customEmojis.slice(this.customEmojiCounter, this.customEmojiCounter + amount)
          )
        } else {
          window.clearInterval(this.customEmojiInterval)
        }
        this.customEmojiCounter += amount
      }, interval)
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
      this.scrolledGroup()
      this.restartInterval()
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
