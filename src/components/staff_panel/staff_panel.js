import map from 'lodash/map'
import BasicUserCard from '../basic_user_card/basic_user_card.vue'

const StaffPanel = {
  created () {
    const nicknames = this.$store.state.instance.staffAccounts
    nicknames.forEach(nickname => this.$store.dispatch('fetchUserIfMissing', nickname))
  },
  components: {
    BasicUserCard
  },
  computed: {
    staffAccounts () {
      return map(this.$store.state.instance.staffAccounts, nickname => this.$store.getters.findUser(nickname)).filter(_ => _)
    }
  }
}

export default StaffPanel
