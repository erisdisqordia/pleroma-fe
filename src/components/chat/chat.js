import _ from 'lodash'
import { WSConnectionStatus } from '../../services/api/api.service.js'
import { mapGetters, mapState } from 'vuex'
import ChatMessage from '../chat_message/chat_message.vue'
import ChatAvatar from '../chat_avatar/chat_avatar.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'
import ChatTitle from '../chat_title/chat_title.vue'
import chatService from '../../services/chat_service/chat_service.js'
import ChatLayout from './chat_layout.js'
import { getScrollPosition, getNewTopPosition, isBottomedOut, scrollableContainerHeight } from './chat_layout_utils.js'

const BOTTOMED_OUT_OFFSET = 10
const JUMP_TO_BOTTOM_BUTTON_VISIBILITY_OFFSET = 150

const Chat = {
  components: {
    ChatMessage,
    ChatTitle,
    ChatAvatar,
    PostStatusForm
  },
  mixins: [ChatLayout],
  data () {
    return {
      jumpToBottomButtonVisible: false,
      hoveredMessageChainId: undefined,
      scrollPositionBeforeResize: {},
      scrollableContainerHeight: '100%',
      errorLoadingChat: false
    }
  },
  created () {
    this.startFetching()
    window.addEventListener('resize', this.handleLayoutChange)
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange, false)
    }

    this.$nextTick(() => {
      this.updateScrollableContainerHeight()
      this.handleResize()
    })
    this.setChatLayout()
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleLayoutChange)
    this.unsetChatLayout()
    if (typeof document.hidden !== 'undefined') document.removeEventListener('visibilitychange', this.handleVisibilityChange, false)
    this.$store.dispatch('clearCurrentChat')
  },
  computed: {
    recipient () {
      return this.currentChat && this.currentChat.account
    },
    recipientId () {
      return this.$route.params.recipient_id
    },
    formPlaceholder () {
      if (this.recipient) {
        return this.$t('chats.message_user', { nickname: this.recipient.screen_name })
      } else {
        return ''
      }
    },
    chatViewItems () {
      return chatService.getView(this.currentChatMessageService)
    },
    newMessageCount () {
      return this.currentChatMessageService && this.currentChatMessageService.newMessageCount
    },
    streamingEnabled () {
      return this.mergedConfig.useStreamingApi && this.mastoUserSocketStatus === WSConnectionStatus.JOINED
    },
    ...mapGetters([
      'currentChat',
      'currentChatMessageService',
      'findOpenedChatByRecipientId',
      'mergedConfig'
    ]),
    ...mapState({
      backendInteractor: state => state.api.backendInteractor,
      mastoUserSocketStatus: state => state.api.mastoUserSocketStatus,
      mobileLayout: state => state.interface.mobileLayout,
      layoutHeight: state => state.interface.layoutHeight,
      currentUser: state => state.users.currentUser
    })
  },
  watch: {
    chatViewItems () {
      // We don't want to scroll to the bottom on a new message when the user is viewing older messages.
      // Therefore we need to know whether the scroll position was at the bottom before the DOM update.
      const bottomedOutBeforeUpdate = this.bottomedOut(BOTTOMED_OUT_OFFSET)
      this.$nextTick(() => {
        if (bottomedOutBeforeUpdate) {
          this.scrollDown({ forceRead: !document.hidden })
        }
      })
    },
    '$route': function () {
      this.startFetching()
    },
    layoutHeight () {
      this.handleResize({ expand: true })
    },
    mastoUserSocketStatus (newValue) {
      if (newValue === WSConnectionStatus.JOINED) {
        this.fetchChat({ isFirstFetch: true })
      }
    }
  },
  methods: {
    // Used to animate the avatar near the first message of the message chain when any message belonging to the chain is hovered
    onMessageHover ({ isHovered, messageChainId }) {
      this.hoveredMessageChainId = isHovered ? messageChainId : undefined
    },
    onFilesDropped () {
      this.$nextTick(() => {
        this.updateScrollableContainerHeight()
      })
    },
    handleVisibilityChange () {
      this.$nextTick(() => {
        if (!document.hidden && this.bottomedOut(BOTTOMED_OUT_OFFSET)) {
          this.scrollDown({ forceRead: true })
        }
      })
    },
    handleLayoutChange () {
      this.updateScrollableContainerHeight()
      if (this.mobileLayout) {
        this.setMobileChatLayout()
      } else {
        this.unsetMobileChatLayout()
      }
      this.$nextTick(() => {
        this.updateScrollableContainerHeight()
        this.scrollDown()
      })
    },
    // Ensures the proper position of the posting form in the mobile layout (the mobile browser panel does not overlap or hide it)
    updateScrollableContainerHeight () {
      const header = this.$refs.header
      const footer = this.$refs.footer
      const inner = this.mobileLayout ? window.document.body : this.$refs.inner
      this.scrollableContainerHeight = scrollableContainerHeight(inner, header, footer) + 'px'
    },
    // Preserves the scroll position when OSK appears or the posting form changes its height.
    handleResize (opts) {
      this.$nextTick(() => {
        this.updateScrollableContainerHeight()

        const { offsetHeight = undefined } = this.scrollPositionBeforeResize
        this.scrollPositionBeforeResize = getScrollPosition(this.$refs.scrollable)

        const diff = this.scrollPositionBeforeResize.offsetHeight - offsetHeight
        if (diff < 0 || (!this.bottomedOut() && opts && opts.expand)) {
          this.$nextTick(() => {
            this.updateScrollableContainerHeight()
            this.$refs.scrollable.scrollTo({
              top: this.$refs.scrollable.scrollTop - diff,
              left: 0
            })
          })
        }
      })
    },
    scrollDown (options = {}) {
      const { behavior = 'auto', forceRead = false } = options
      const scrollable = this.$refs.scrollable
      if (!scrollable) { return }
      this.$nextTick(() => {
        scrollable.scrollTo({ top: scrollable.scrollHeight, left: 0, behavior })
      })
      if (forceRead || this.newMessageCount > 0) {
        this.readChat()
      }
    },
    readChat () {
      if (!(this.currentChatMessageService && this.currentChatMessageService.lastMessage)) { return }
      if (document.hidden) { return }
      const lastReadId = this.currentChatMessageService.lastMessage.id
      this.$store.dispatch('readChat', { id: this.currentChat.id, lastReadId })
    },
    bottomedOut (offset) {
      return isBottomedOut(this.$refs.scrollable, offset)
    },
    reachedTop () {
      const scrollable = this.$refs.scrollable
      return scrollable && scrollable.scrollTop <= 0
    },
    handleScroll: _.throttle(function () {
      if (!this.currentChat) { return }

      if (this.reachedTop()) {
        this.fetchChat({ maxId: this.currentChatMessageService.minId })
      } else if (this.bottomedOut(JUMP_TO_BOTTOM_BUTTON_VISIBILITY_OFFSET)) {
        this.jumpToBottomButtonVisible = false
        if (this.newMessageCount > 0) {
          this.readChat()
        }
      } else {
        this.jumpToBottomButtonVisible = true
      }
    }, 100),
    handleScrollUp (positionBeforeLoading) {
      const positionAfterLoading = getScrollPosition(this.$refs.scrollable)
      this.$refs.scrollable.scrollTo({
        top: getNewTopPosition(positionBeforeLoading, positionAfterLoading),
        left: 0
      })
    },
    fetchChat ({ isFirstFetch = false, fetchLatest = false, maxId }) {
      const chatMessageService = this.currentChatMessageService
      if (!chatMessageService) { return }
      if (fetchLatest && this.streamingEnabled) { return }

      const chatId = chatMessageService.chatId
      const fetchOlderMessages = !!maxId
      const sinceId = fetchLatest && chatMessageService.lastMessage && chatMessageService.lastMessage.id

      this.backendInteractor.chatMessages({ id: chatId, maxId, sinceId })
        .then((messages) => {
          // Clear the current chat in case we're recovering from a ws connection loss.
          if (isFirstFetch) {
            chatService.clear(chatMessageService)
          }

          const positionBeforeUpdate = getScrollPosition(this.$refs.scrollable)
          this.$store.dispatch('addChatMessages', { chatId, messages }).then(() => {
            this.$nextTick(() => {
              if (fetchOlderMessages) {
                this.handleScrollUp(positionBeforeUpdate)
              }

              if (isFirstFetch) {
                this.updateScrollableContainerHeight()
              }
            })
          })
        })
    },
    async startFetching () {
      let chat = this.findOpenedChatByRecipientId(this.recipientId)
      if (!chat) {
        try {
          chat = await this.backendInteractor.getOrCreateChat({ accountId: this.recipientId })
        } catch (e) {
          console.error('Error creating or getting a chat', e)
          this.errorLoadingChat = true
        }
      }
      if (chat) {
        this.$nextTick(() => {
          this.scrollDown({ forceRead: true })
        })
        this.$store.dispatch('addOpenedChat', { chat })
        this.doStartFetching()
      }
    },
    doStartFetching () {
      this.$store.dispatch('startFetchingCurrentChat', {
        fetcher: () => setInterval(() => this.fetchChat({ fetchLatest: true }), 5000)
      })
      this.fetchChat({ isFirstFetch: true })
    },
    sendMessage ({ status, media }) {
      const params = {
        id: this.currentChat.id,
        content: status
      }

      if (media[0]) {
        params.mediaId = media[0].id
      }

      return this.backendInteractor.sendChatMessage(params)
        .then(data => {
          this.$store.dispatch('addChatMessages', { chatId: this.currentChat.id, messages: [data] }).then(() => {
            this.$nextTick(() => {
              this.updateScrollableContainerHeight()
              this.scrollDown({ forceRead: true })
            })
          })

          return data
        })
        .catch(error => {
          console.error('Error sending message', error)
          return {
            error: this.$t('chats.error_sending_message')
          }
        })
    },
    goBack () {
      this.$router.push({ name: 'chats', params: { username: this.currentUser.screen_name } })
    }
  }
}

export default Chat
