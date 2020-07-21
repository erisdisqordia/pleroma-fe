import UserAvatar from '../user_avatar/user_avatar.vue'
import UserListPopover from '../user_list_popover/user_list_popover.vue'

const EMOJI_REACTION_COUNT_CUTOFF = 12

const EmojiReactions = {
  name: 'EmojiReactions',
  components: {
    UserAvatar,
    UserListPopover
  },
  props: ['status'],
  data: () => ({
    showAll: false
  }),
  computed: {
    tooManyReactions () {
      return this.status.emoji_reactions.length > EMOJI_REACTION_COUNT_CUTOFF
    },
    emojiReactions () {
      return this.showAll
        ? this.status.emoji_reactions
        : this.status.emoji_reactions.slice(0, EMOJI_REACTION_COUNT_CUTOFF)
    },
    showMoreString () {
      return `+${this.status.emoji_reactions.length - EMOJI_REACTION_COUNT_CUTOFF}`
    },
    accountsForEmoji () {
      return this.status.emoji_reactions.reduce((acc, reaction) => {
        acc[reaction.name] = reaction.accounts || []
        return acc
      }, {})
    },
    loggedIn () {
      return !!this.$store.state.users.currentUser
    }
  },
  methods: {
    toggleShowAll () {
      this.showAll = !this.showAll
    },
    reactedWith (emoji) {
      return this.status.emoji_reactions.find(r => r.name === emoji).me
    },
    fetchEmojiReactionsByIfMissing () {
      const hasNoAccounts = this.status.emoji_reactions.find(r => !r.accounts)
      if (hasNoAccounts) {
        this.$store.dispatch('fetchEmojiReactionsBy', this.status.id)
      }
    },
    reactWith (emoji) {
      this.$store.dispatch('reactWithEmoji', { id: this.status.id, emoji })
    },
    unreact (emoji) {
      this.$store.dispatch('unreactWithEmoji', { id: this.status.id, emoji })
    },
    emojiOnClick (emoji, event) {
      if (!this.loggedIn) return

      if (this.reactedWith(emoji)) {
        this.unreact(emoji)
      } else {
        this.reactWith(emoji)
      }
    }
  }
}

export default EmojiReactions
