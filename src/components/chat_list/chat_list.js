import { mapState, mapGetters } from 'vuex'
import ChatListItem from '../chat_list_item/chat_list_item.vue'
import ChatNew from '../chat_new/chat_new.vue'
import List from '../list/list.vue'

const ChatList = {
  components: {
    ChatListItem,
    List,
    ChatNew
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser
    }),
    ...mapGetters(['sortedChatList'])
  },
  data () {
    return {
      isNew: false
    }
  },
  created () {
    this.$store.dispatch('fetchChats', { latest: true })
  },
  methods: {
    cancelNewChat () {
      this.isNew = false
      this.$store.dispatch('fetchChats', { latest: true })
    },
    newChat () {
      this.isNew = true
    }
  }
}

export default ChatList
