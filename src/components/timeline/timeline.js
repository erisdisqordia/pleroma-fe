import Status from '../status/status.vue'
import timelineFetcher from '../../services/timeline_fetcher/timeline_fetcher.service.js'
import Conversation from '../conversation/conversation.vue'
import { throttle, keyBy } from 'lodash'

export const getExcludedStatusIdsByPinning = (statuses, pinnedStatusIds) => {
  const ids = []
  if (pinnedStatusIds && pinnedStatusIds.length > 0) {
    for (let status of statuses) {
      if (!pinnedStatusIds.includes(status.id)) {
        break
      }
      ids.push(status.id)
    }
  }
  return ids
}

const Timeline = {
  props: [
    'timeline',
    'timelineName',
    'title',
    'userId',
    'tag',
    'embedded',
    'count',
    'pinnedStatusIds',
    'inProfile'
  ],
  data () {
    return {
      paused: false,
      unfocused: false,
      bottomedOut: false
    }
  },
  computed: {
    timelineError () {
      return this.$store.state.statuses.error
    },
    errorData () {
      return this.$store.state.statuses.errorData
    },
    newStatusCount () {
      return this.timeline.newStatusCount
    },
    showLoadButton () {
      if (this.timelineError || this.errorData) return false
      return this.timeline.newStatusCount > 0 || this.timeline.flushMarker !== 0
    },
    loadButtonString () {
      if (this.timeline.flushMarker !== 0) {
        return this.$t('timeline.reload')
      } else {
        return `${this.$t('timeline.show_new')} (${this.newStatusCount})`
      }
    },
    classes () {
      return {
        root: ['timeline'].concat(!this.embedded ? ['panel', 'panel-default'] : []),
        header: ['timeline-heading'].concat(!this.embedded ? ['panel-heading'] : []),
        body: ['timeline-body'].concat(!this.embedded ? ['panel-body'] : []),
        footer: ['timeline-footer'].concat(!this.embedded ? ['panel-footer'] : [])
      }
    },
    // id map of statuses which need to be hidden in the main list due to pinning logic
    excludedStatusIdsObject () {
      const ids = getExcludedStatusIdsByPinning(this.timeline.visibleStatuses, this.pinnedStatusIds)
      // Convert id array to object
      return keyBy(ids)
    },
    pinnedStatusIdsObject () {
      return keyBy(this.pinnedStatusIds)
    }
  },
  components: {
    Status,
    Conversation
  },
  created () {
    const store = this.$store
    const credentials = store.state.users.currentUser.credentials
    const showImmediately = this.timeline.visibleStatuses.length === 0

    window.addEventListener('scroll', this.scrollLoad)

    if (store.state.api.fetchers[this.timelineName]) { return false }

    timelineFetcher.fetchAndUpdate({
      store,
      credentials,
      timeline: this.timelineName,
      showImmediately,
      userId: this.userId,
      tag: this.tag
    })
  },
  mounted () {
    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange, false)
      this.unfocused = document.hidden
    }
    window.addEventListener('keydown', this.handleShortKey)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollLoad)
    window.removeEventListener('keydown', this.handleShortKey)
    if (typeof document.hidden !== 'undefined') document.removeEventListener('visibilitychange', this.handleVisibilityChange, false)
    this.$store.commit('setLoading', { timeline: this.timelineName, value: false })
  },
  methods: {
    handleShortKey (e) {
      // Ignore when input fields are focused
      if (['textarea', 'input'].includes(e.target.tagName.toLowerCase())) return
      if (e.key === '.') this.showNewStatuses()
    },
    showNewStatuses () {
      if (this.timeline.flushMarker !== 0) {
        this.$store.commit('clearTimeline', { timeline: this.timelineName, excludeUserId: true })
        this.$store.commit('queueFlush', { timeline: this.timelineName, id: 0 })
        this.fetchOlderStatuses()
      } else {
        this.$store.commit('showNewStatuses', { timeline: this.timelineName })
        this.paused = false
      }
    },
    fetchOlderStatuses: throttle(function () {
      const store = this.$store
      const credentials = store.state.users.currentUser.credentials
      store.commit('setLoading', { timeline: this.timelineName, value: true })
      timelineFetcher.fetchAndUpdate({
        store,
        credentials,
        timeline: this.timelineName,
        older: true,
        showImmediately: true,
        userId: this.userId,
        tag: this.tag
      }).then(({ statuses }) => {
        store.commit('setLoading', { timeline: this.timelineName, value: false })
        if (statuses && statuses.length === 0) {
          this.bottomedOut = true
        }
      })
    }, 1000, this),
    scrollLoad (e) {
      const bodyBRect = document.body.getBoundingClientRect()
      const height = Math.max(bodyBRect.height, -(bodyBRect.y))
      if (this.timeline.loading === false &&
          this.$store.getters.mergedConfig.autoLoad &&
          this.$el.offsetHeight > 0 &&
          (window.innerHeight + window.pageYOffset) >= (height - 750)) {
        this.fetchOlderStatuses()
      }
    },
    handleVisibilityChange () {
      this.unfocused = document.hidden
    }
  },
  watch: {
    newStatusCount (count) {
      if (!this.$store.getters.mergedConfig.streaming) {
        return
      }
      if (count > 0) {
        // only 'stream' them when you're scrolled to the top
        const doc = document.documentElement
        const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
        if (top < 15 &&
            !this.paused &&
            !(this.unfocused && this.$store.getters.mergedConfig.pauseOnUnfocused)
        ) {
          this.showNewStatuses()
        } else {
          this.paused = true
        }
      }
    }
  }
}

export default Timeline
