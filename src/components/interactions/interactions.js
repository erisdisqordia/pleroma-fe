import Notifications from '../notifications/notifications.vue'

const tabModeDict = {
  mentions: ['mention'],
  'likes+repeats': ['repeat', 'like'],
  follows: ['follow']
}

const Interactions = {
  data () {
    return {
      filterMode: tabModeDict['mentions']
    }
  },
  methods: {
    onModeSwitch (index, dataset) {
      this.filterMode = tabModeDict[dataset.filter]
    }
  },
  components: {
    Notifications
  }
}

export default Interactions
