import map from 'lodash/map'
import BasicUserCard from '../basic_user_card/basic_user_card.vue'

const StaffPanel = {
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
