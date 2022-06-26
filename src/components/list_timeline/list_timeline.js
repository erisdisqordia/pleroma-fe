import Timeline from '../timeline/timeline.vue'
const ListTimeline = {
  data () {
    return {
      listId: null
    }
  },
  components: {
    Timeline
  },
  computed: {
    timeline () { return this.$store.state.statuses.timelines.list }
  },
  created () {
    this.listId = this.$route.params.id
    this.$store.dispatch('fetchList', { id: this.listId })
    this.$store.dispatch('startFetchingTimeline', { timeline: 'list', listId: this.listId })
  },
  unmounted () {
    this.$store.dispatch('stopFetchingTimeline', 'list')
    this.$store.commit('clearTimeline', { timeline: 'list' })
  }
}

export default ListTimeline
