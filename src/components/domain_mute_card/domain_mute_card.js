import ProgressButton from '../progress_button/progress_button.vue'

const DomainMuteCard = {
  props: ['domain'],
  components: {
    ProgressButton
  },
  methods: {
    unmuteDomain () {
      return this.$store.dispatch('unmuteDomain', this.domain)
    }
  }
}

export default DomainMuteCard
