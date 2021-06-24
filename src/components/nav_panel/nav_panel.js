import TimelineMenuContent from '../timeline_menu/timeline_menu_content.vue'
import { mapState, mapGetters } from 'vuex'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUsers,
  faGlobe,
  faBookmark,
  faEnvelope,
  faChevronDown,
  faChevronUp,
  faMoon,
  faComments,
  faBolt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUsers,
  faGlobe,
  faBookmark,
  faEnvelope,
  faChevronDown,
  faChevronUp,
  faMoon,
  faComments,
  faBolt,
  faInfoCircle
)

const NavPanel = {
  created () {
    if (this.currentUser && this.currentUser.locked) {
      this.$store.dispatch('startFetchingFollowRequests')
    }
  },
  components: {
    TimelineMenuContent
  },
  data () {
    return {
      showTimelines: false
    }
  },
  methods: {
    toggleTimelines () {
      this.showTimelines = !this.showTimelines
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser,
      followRequestCount: state => state.api.followRequests.length,
      privateMode: state => state.instance.private,
      federating: state => state.instance.federating,
      pleromaChatMessagesAvailable: state => state.instance.pleromaChatMessagesAvailable
    }),
    hideFollowRequestCount () {
      return this.$store.getters.mergedConfig.hideFollowRequestCount
    },
    ...mapGetters(['unreadChatCount', 'mergedConfig'])
  }
}

export default NavPanel
