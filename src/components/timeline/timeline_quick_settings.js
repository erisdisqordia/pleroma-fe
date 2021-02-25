import Popover from '../popover/popover.vue'
import BooleanSetting from '../settings_modal/helpers/boolean_setting.vue'
import { mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFilter, faWrench } from '@fortawesome/free-solid-svg-icons'

library.add(
  faFilter,
  faWrench
)

const TimelineQuickSettings = {
  components: {
    Popover,
    BooleanSetting
  },
  methods: {
    setReplyVisibility (visibility) {
      console.log('set reply visibility', visibility)
      this.$store.dispatch('setOption', { name: 'replyVisibility', value: visibility })
      this.$store.dispatch('queueFlushAll')
    },
    openTab (tab) {
      this.$store.dispatch('openSettingsModalTab', tab)
    }
  },
  computed: {
    ...mapGetters(['mergedConfig']),
    replyVisibilitySelf: {
      get () { return this.mergedConfig.replyVisibility === 'self' },
      set () { this.setReplyVisibility('self') }
    },
    replyVisibilityFollowing: {
      get () { return this.mergedConfig.replyVisibility === 'following' },
      set () { this.setReplyVisibility('following') }
    },
    replyVisibilityAll: {
      get () { return this.mergedConfig.replyVisibility === 'all' },
      set () { this.setReplyVisibility('all') }
    },
    hideMedia: {
      get () { return this.mergedConfig.hideAttachments || this.mergedConfig.hideAttachmentsInConv },
      set () {
        const value = !this.hideMedia
        this.$store.dispatch('setOption', { name: 'hideAttachments', value })
        this.$store.dispatch('setOption', { name: 'hideAttachmentsInConv', value })
      }
    },
    hideMutedPosts: {
      get () { return this.mergedConfig.hideMutedPosts || this.mergedConfig.hideFilteredStatuses },
      set () {
        const value = !this.hideMutedPosts
        this.$store.dispatch('setOption', { name: 'hideMutedPosts', value })
        this.$store.dispatch('setOption', { name: 'hideFilteredStatuses', value })
      }
    }
  }
}

export default TimelineQuickSettings
