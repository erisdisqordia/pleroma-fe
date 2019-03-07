import BasicUserCard from '../basic_user_card/basic_user_card.vue'

const MuteCard = {
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
    muted () {
      return this.user.muted
    }
  },
  components: {
    BasicUserCard
  },
  methods: {
    unmuteUser () {
      this.progress = true
      this.$store.dispatch('unmuteUser', this.user.id).then(() => {
        this.progress = false
      })
    },
    muteUser () {
      this.progress = true
      this.$store.dispatch('muteUser', this.user.id).then(() => {
        this.progress = false
      })
    }
  }
}

export default MuteCard
