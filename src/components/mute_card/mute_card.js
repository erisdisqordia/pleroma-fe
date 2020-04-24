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
      return this.$store.getters.findUser(this.userId)
    },
    relationship () {
      return this.$store.getters.relationship(this.userId)
    },
    muted () {
      return this.relationship.muting
    }
  },
  components: {
    BasicUserCard
  },
  methods: {
    unmuteUser () {
      this.progress = true
      this.$store.dispatch('unmuteUser', this.userId).then(() => {
        this.progress = false
      })
    },
    muteUser () {
      this.progress = true
      this.$store.dispatch('muteUser', this.userId).then(() => {
        this.progress = false
      })
    }
  }
}

export default MuteCard
