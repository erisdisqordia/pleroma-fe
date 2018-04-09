import Status from '../status/status.vue'
import StillImage from '../still-image/still-image.vue'
import UserCardContent from '../user_card_content/user_card_content.vue'

const Notification = {
  data () {
    return {
      userExpanded: false
    }
  },
  props: [
    'notification'
  ],
  components: {
    Status, StillImage, UserCardContent
  },
  methods: {
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    }
  }
}

export default Notification
