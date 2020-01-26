
const EmojiReactions = {
  name: 'EmojiReactions',
  props: ['status'],
  computed: {
    emojiReactions () {
      console.log(this.status.emoji_reactions)
      return this.status.emoji_reactions
    }
  },
  methods: {
    reactedWith (emoji) {
      // return []
      const user = this.$store.state.users.currentUser
      const reaction = this.status.emoji_reactions.find(r => r.emoji === emoji)
      console.log(reaction)
      return reaction.accounts && reaction.accounts.find(u => u.id === user.id)
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
