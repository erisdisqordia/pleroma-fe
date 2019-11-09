import BasicUserCard from '../basic_user_card/basic_user_card.vue'

const StaffPanel = {
  components: {
    BasicUserCard
  },
  computed: {
    staffAccounts() {
      return this.$store.state.instance.staffAccounts
    }
  }
}

export default StaffPanel

