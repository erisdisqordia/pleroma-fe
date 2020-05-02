import BasicUserCard from '../basic_user_card/basic_user_card.vue'
import { notificationsFromStore } from '../../services/notification_utils/notification_utils.js'

const FollowRequestCard = {
  props: ['user'],
  components: {
    BasicUserCard
  },
  methods: {
    findFollowRequestNotificationId () {
      const notif = notificationsFromStore(this.$store).find(
        (notif) => notif.from_profile.id === this.user.id && notif.type === 'follow_request'
      )
      return notif && notif.id
    },
    approveUser () {
      this.$store.state.api.backendInteractor.approveUser({ id: this.user.id })
      this.$store.dispatch('removeFollowRequest', this.user)

      const notifId = this.findFollowRequestNotificationId()
      this.$store.dispatch('markSingleNotificationAsSeen', { id: notifId })
      this.$store.dispatch('updateNotification', {
        id: notifId,
        updater: notification => {
          notification.type = 'follow'
        }
      })
    },
    denyUser () {
      const notifId = this.findFollowRequestNotificationId()
      this.$store.state.api.backendInteractor.denyUser({ id: this.user.id })
        .then(() => {
          this.$store.dispatch('dismissNotificationLocal', { id: notifId })
          this.$store.dispatch('removeFollowRequest', this.user)
        })
    }
  }
}

export default FollowRequestCard
