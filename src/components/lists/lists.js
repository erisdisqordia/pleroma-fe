import ListCard from '../list_card/list_card.vue'
import ListNew from '../list_new/list_new.vue'

const Lists = {
  data () {
    return {
      isNew: false
    }
  },
  components: {
    ListCard,
    ListNew
  },
  created () {
    this.$store.dispatch('startFetchingLists')
  },
  computed: {
    lists () {
      return this.$store.state.lists.allLists
    }
  },
  methods: {
    cancelNewList () {
      this.isNew = false
    },
    newList () {
      this.isNew = true
    }
  }
}

export default Lists
