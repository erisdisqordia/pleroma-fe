const filterByKeyword = (list, keyword = '') => {
  return list.filter(x => x.displayText.includes(keyword))
}

const EmojiPicker = {
  data () {
    return {
      keyword: '',
      activeGroup: 'standard',
      showingAdditional: false
    }
  },
  methods: {
    onEmoji (emoji) {
      const value = emoji.imageUrl ? `:${emoji.displayText}:` : emoji.replacement
      this.$emit('emoji', ` ${value} `)
      this.open = false
    },
    highlight (key) {
      const ref = this.$refs['group-' + key]
      const top = ref[0].offsetTop
      this.$refs['emoji-groups'].scrollTop = top + 1
      this.activeGroup = key
    },
    scrolledGroup (e) {
      const top = e.target.scrollTop
      Object.keys(this.emojis).forEach(key => {
        if (this.$refs['group-' + key][0].offsetTop < top) {
          this.activeGroup = key
        }
      })
    },
    toggleAdditional (value) {
      this.showingAdditional = value
    }
  },
  computed: {
    emojis () {
      const standardEmojis = this.$store.state.instance.emoji || []
      const customEmojis = this.$store.state.instance.customEmoji || []
      return {
        custom: {
          text: 'Custom',
          icon: 'icon-picture',
          emojis: filterByKeyword(customEmojis, this.keyword)
        },
        standard: {
          text: 'Standard',
          icon: 'icon-star',
          emojis: filterByKeyword(standardEmojis, this.keyword)
        }
      }
    }
  }
}

export default EmojiPicker
