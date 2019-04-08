const filterByKeyword = (list, keyword = '') => {
  return list.filter(x => x.shortcode.indexOf(keyword) !== -1)
}

const EmojiSelector = {
  mounted () {
    document.body.addEventListener('click', this.outsideClicked)
  },
  destroyed () {
    document.body.removeEventListener('click', this.outsideClicked)
  },
  data () {
    return {
      open: false,
      keyword: '',
      activeGroup: 'standard'
    }
  },
  methods: {
    togglePanel () {
      this.open = !this.open
    },
    insideClicked (e) {
      e.stopPropagation()
    },
    outsideClicked () {
      this.open = false
    },
    onEmoji (emoji) {
      const value = emoji.image_url ? `:${emoji.shortcode}:` : emoji.utf
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
    },
    serverUrl () {
      return this.$store.state.instance.server
    }
  }
}

export default EmojiSelector
