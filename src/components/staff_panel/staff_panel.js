import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import { mapGetters, mapState } from 'vuex'
import BasicUserCard from '../basic_user_card/basic_user_card.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPastafarianism
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faPastafarianism
)

const StaffPanel = {
  created () {
    const nicknames = this.$store.state.instance.staffAccounts
    nicknames.forEach(nickname => this.$store.dispatch('fetchUserIfMissing', nickname))
  },
  components: {
    BasicUserCard
  },
  computed: {
    groupedStaffAccounts () {
      const staffAccounts = map(this.staffAccounts, this.findUser).filter(_ => _)
      const groupedStaffAccounts = groupBy(staffAccounts, 'role')

      return [
        { role: 'admin', users: groupedStaffAccounts['admin'] },
        { role: 'moderator', users: groupedStaffAccounts['moderator'] }
      ].filter(group => group.users)
    },
    ...mapGetters([
      'findUser'
    ]),
    ...mapState({
      staffAccounts: state => state.instance.staffAccounts
    })
  }
}

export default StaffPanel
