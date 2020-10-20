import Popover from '../popover/popover.vue'
import { mapState } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUsers,
  faGlobe,
  faBookmark,
  faEnvelope,
  faHome,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUsers,
  faGlobe,
  faBookmark,
  faEnvelope,
  faHome,
  faChevronDown
)

// Route -> i18n key mapping, exported andnot in the computed
// because nav panel benefits from the same information.
export const timelineNames = () => {
  return {
    'friends': 'nav.timeline',
    'bookmarks': 'nav.bookmarks',
    'dms': 'nav.dms',
    'public-timeline': 'nav.public_tl',
    'public-external-timeline': 'nav.twkn',
    'tag-timeline': 'tag'
  }
}

const TimelineMenu = {
  components: {
    Popover
  },
  data () {
    return {
      isOpen: false
    }
  },
  created () {
    if (this.currentUser && this.currentUser.locked) {
      this.$store.dispatch('startFetchingFollowRequests')
    }
    if (timelineNames()[this.$route.name]) {
      this.$store.dispatch('setLastTimeline', this.$route.name)
    }
  },
  methods: {
    openMenu () {
      // $nextTick is too fast, animation won't play back but
      // instead starts in fully open position. Low values
      // like 1-5 work on fast machines but not on mobile, 25
      // seems like a good compromise that plays without significant
      // added lag.
      setTimeout(() => {
        this.isOpen = true
      }, 25)
    },
    timelineName () {
      const route = this.$route.name
      if (route === 'tag-timeline') {
        return '#' + this.$route.params.tag
      }
      const i18nkey = timelineNames()[this.$route.name]
      return i18nkey ? this.$t(i18nkey) : route
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser,
      privateMode: state => state.instance.private,
      federating: state => state.instance.federating
    })
  }
}

export default TimelineMenu
