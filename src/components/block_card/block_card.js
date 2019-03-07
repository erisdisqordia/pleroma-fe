import BasicUserCard from '../basic_user_card/basic_user_card.vue'

const BlockCard = {
  props: ['userId'],
  data () {
    return {
      progress: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.userById(this.userId)
    },
    blocked () {
      return this.user.statusnet_blocking
    }
  },
  components: {
    BasicUserCard
  },
  methods: {
    unblockUser () {
      this.progress = true
      this.$store.dispatch('unblockUser', this.user.id).then(() => {
        this.progress = false
      })
    },
    blockUser () {
      this.progress = true
      this.$store.dispatch('blockUser', this.user.id).then(() => {
        this.progress = false
      })
    }
  }
}

export default BlockCard
