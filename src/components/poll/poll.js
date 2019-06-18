import Timeago from '../timeago/timeago.vue'
import { forEach, map } from 'lodash'

export default {
  name: 'Poll',
  props: ['poll', 'statusId'],
  components: { Timeago },
  data () {
    return {
      loading: false,
      choices: [],
      refreshInterval: null
    }
  },
  created () {
    this.refreshInterval = setTimeout(this.refreshPoll, 30 * 1000)
    // Initialize choices to booleans and set its length to match options
    this.choices = this.poll.options.map(_ => false)
  },
  destroyed () {
    clearTimeout(this.refreshInterval)
  },
  computed: {
    expired () {
      return Date.now() > Date.parse(this.poll.expires_at)
    },
    loggedIn () {
      return this.$store.state.users.currentUser
    },
    showResults () {
      return this.poll.voted || this.expired || !this.loggedIn
    },
    totalVotesCount () {
      return this.poll.votes_count
    },
    expiresAt () {
      return Date.parse(this.poll.expires_at).toLocaleString()
    },
    containerClass () {
      return {
        loading: this.loading
      }
    },
    choiceIndices () {
      // Convert array of booleans into an array of indices of the
      // items that were 'true', so [true, false, false, true] becomes
      // [0, 3].
      return this.choices
        .map((entry, index) => entry && index)
        .filter(value => typeof value === 'number')
    },
    isDisabled () {
      const noChoice = this.choiceIndices.length === 0
      return this.loading || noChoice
    }
  },
  methods: {
    refreshPoll () {
      if (this.expired) return
      this.fetchPoll()
      this.refreshInterval = setTimeout(this.refreshPoll, 30 * 1000)
    },
    percentageForOption (count) {
      return this.totalVotesCount === 0 ? 0 : Math.round(count / this.totalVotesCount * 100)
    },
    resultTitle (option) {
      return `${option.votes_count}/${this.totalVotesCount} ${this.$t('polls.votes')}`
    },
    fetchPoll () {
      this.$store.dispatch('refreshPoll', { id: this.statusId, pollId: this.poll.id })
    },
    activateOption (index) {
      // forgive me father: doing checking the radio/checkboxes
      // in code because of customized input elements need either
      // a) an extra element for the actual graphic, or b) use a
      // pseudo element for the label. We use b) which mandates
      // using "for" and "id" matching which isn't nice when the
      // same poll appears multiple times on the site (notifs and
      // timeline for example). With code we can make sure it just
      // works without altering the pseudo element implementation.
      const allElements = this.$el.querySelectorAll('input')
      const clickedElement = this.$el.querySelector(`input[value="${index}"]`)
      if (this.poll.multiple) {
        // Checkboxes, toggle only the clicked one
        clickedElement.checked = !clickedElement.checked
      } else {
        // Radio button, uncheck everything and check the clicked one
        forEach(allElements, element => { element.checked = false })
        clickedElement.checked = true
      }
      this.choices = map(allElements, e => e.checked)
    },
    optionId (index) {
      return `poll${this.poll.id}-${index}`
    },
    vote () {
      if (this.choiceIndices.length === 0) return
      this.loading = true
      this.$store.dispatch(
        'votePoll',
        { id: this.statusId, pollId: this.poll.id, choices: this.choiceIndices }
      ).then(poll => {
        this.loading = false
      })
    }
  }
}