import { mapState } from 'vuex'
import StatusContent from '../status_content/status_content.vue'
import fileType from 'src/services/file_type/file_type.service'
import UserAvatar from '../user_avatar/user_avatar.vue'
import AvatarList from '../avatar_list/avatar_list.vue'
import Timeago from '../timeago/timeago.vue'
import ChatTitle from '../chat_title/chat_title.vue'

const ChatListItem = {
  name: 'ChatListItem',
  props: [
    'chat'
  ],
  components: {
    UserAvatar,
    AvatarList,
    Timeago,
    ChatTitle,
    StatusContent
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser
    }),
    attachmentInfo () {
      if (this.chat.lastMessage.attachments.length === 0) { return }

      const types = this.chat.lastMessage.attachments.map(file => fileType.fileType(file.mimetype))
      if (types.includes('video')) {
        return this.$t('file_type.video')
      } else if (types.includes('audio')) {
        return this.$t('file_type.audio')
      } else if (types.includes('image')) {
        return this.$t('file_type.image')
      } else {
        return this.$t('file_type.file')
      }
    },
    messageForStatusContent () {
      const content = this.chat.lastMessage ? (this.attachmentInfo || this.chat.lastMessage.content) : ''

      return {
        summary: '',
        statusnet_html: content,
        text: content,
        attachments: []
      }
    }
  },
  methods: {
    openChat (_e) {
      if (this.chat.id) {
        this.$router.push({
          name: 'chat',
          params: {
            username: this.currentUser.screen_name,
            recipient_id: this.chat.account.id
          }
        })
      }
    }
  }
}

export default ChatListItem
