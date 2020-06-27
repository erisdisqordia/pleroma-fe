import ProgressButton from '../progress_button/progress_button.vue'

const DomainMuteCard = {
  props: ['domain'],
  components: {
    ProgressButton
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    },
    muted () {
      return this.user.domainMutes.includes(this.domain)
    }
  },
  methods: {
    unmuteDomain () {
      return this.$store.dispatch('unmuteDomain', this.domain)
    },
    muteDomain () {
      return this.$store.dispatch('muteDomain', this.domain)
    }
  }
}

export default DomainMuteCard
