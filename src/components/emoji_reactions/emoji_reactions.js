
const EmojiReactions = {
  name: 'EmojiReactions',
  props: ['status'],
  computed: {
    emojiReactions () {
      return this.status.emojiReactions
    }
  },
  methods: {
    reactedWith (emoji) {
      return this.status.reactedWithEmoji.includes(emoji)
    },
    reactWith (emoji) {
      this.$store.dispatch('reactWithEmoji', { id: this.status.id, emoji })
    },
    unreact (emoji) {
      this.$store.dispatch('unreactWithEmoji', { id: this.status.id, emoji })
    },
    emojiOnClick (emoji, event) {
      if (this.reactedWith(emoji)) {
        this.unreact(emoji)
      } else {
        this.reactWith(emoji)
      }
    }
  }
}

export default EmojiReactions
