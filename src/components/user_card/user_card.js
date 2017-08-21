import UserCardContent from '../user_card_content/user_card_content.vue'

const UserCard = {
  props: [
    'user',
    'showFollows'
  ],
  data () {
    return {
      userExpanded: false
    }
  },
  components: {
    UserCardContent
  },
  methods: {
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    }
  }
}

export default UserCard
