import Status from '../status/status.vue'

const Timeline = {
  props: [
    'timeline',
    'timelineName'
  ],
  components: {
    Status
  },
  methods: {
    showNewStatuses () {
      this.$store.commit('showNewStatuses', { timeline: this.timelineName })
    }
  }
}

export default Timeline
