import Notifications from '../notifications/notifications.vue'

const tabModeDict = {
  mentions: ['mention'],
  'likes+repeats': ['repeat', 'like'],
  follows: ['follow'],
  moves: ['move']
}

const Interactions = {
  data () {
    return {
      filterMode: tabModeDict['mentions']
    }
  },
  methods: {
    onModeSwitch (key) {
      this.filterMode = tabModeDict[key]
    }
  },
  components: {
    Notifications
  }
}

export default Interactions
