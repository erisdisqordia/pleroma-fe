const filterByKeyword = (list, keyword = '') => {
  return list.filter(x => x.shortcode.indexOf(keyword) !== -1)
}

const EmojiSelector = {
  data () {
    return {
      open: false,
      keyword: ''
    }
  },
  methods: {
    togglePanel () {
      this.open = !this.open
    },
    onEmoji (emoji) {
      const value = emoji.image_url ? `:${emoji.shortcode}:` : emoji.utf
      this.$emit('emoji', ` ${value} `)
      this.open = false
    }
  },
  computed: {
    emojis () {
      const standardEmojis = this.$store.state.instance.emoji || []
      const customEmojis = this.$store.state.instance.customEmoji || []
      return {
        standard: {
          text: 'Standard',
          icon: 'icon-star',
          emojis: filterByKeyword(standardEmojis, this.keyword)
        },
        custom: {
          text: 'Custom',
          icon: 'icon-picture',
          emojis: filterByKeyword(customEmojis, this.keyword)
        }
      }
    }
  }
}

export default EmojiSelector
