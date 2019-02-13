import BasicUserCard from '../basic_user_card/basic_user_card.vue'

const BlockCard = {
  props: ['user'],
  data () {
    return {
      progress: false,
      updated: false
    }
  },
  components: {
    BasicUserCard
  },
  methods: {
    unblockUser () {
      this.progress = true
    }
  }
}

export default BlockCard
