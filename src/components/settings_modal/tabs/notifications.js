import Checkbox from '../../checkbox/checkbox.vue'

const Notifications = {
  data () {
    return {
      activeTab: 'profile',
      notificationSettings: this.$store.state.users.currentUser.notification_settings,
      newDomainToMute: ''
    }
  },
  components: {
    Checkbox
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    }
  },
  methods: {
    updateNotificationSettings () {
      this.$store.state.api.backendInteractor
        .updateNotificationSettings({ settings: this.notificationSettings })
    }
  }
}

export default Notifications
