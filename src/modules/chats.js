import Vue from 'vue'
import { find, omitBy, orderBy, sumBy } from 'lodash'
import chatService from '../services/chat_service/chat_service.js'
import { parseChat, parseChatMessage } from '../services/entity_normalizer/entity_normalizer.service.js'
import { maybeShowChatNotification } from '../services/chat_utils/chat_utils.js'
import { promiseInterval } from '../services/promise_interval/promise_interval.js'

const emptyChatList = () => ({
  data: [],
  idStore: {}
})

const defaultState = {
  chatList: emptyChatList(),
  chatListFetcher: null,
  openedChats: {},
  openedChatMessageServices: {},
  fetcher: undefined,
  currentChatId: null
}

const getChatById = (state, id) => {
  return find(state.chatList.data, { id })
}

const sortedChatList = (state) => {
  return orderBy(state.chatList.data, ['updated_at'], ['desc'])
}

const unreadChatCount = (state) => {
  return sumBy(state.chatList.data, 'unread')
}

const chats = {
  state: { ...defaultState },
  getters: {
    currentChat: state => state.openedChats[state.currentChatId],
    currentChatMessageService: state => state.openedChatMessageServices[state.currentChatId],
    findOpenedChatByRecipientId: state => recipientId => find(state.openedChats, c => c.account.id === recipientId),
    sortedChatList,
    unreadChatCount
  },
  actions: {
    // Chat list
    startFetchingChats ({ dispatch, commit }) {
      const fetcher = () => dispatch('fetchChats', { latest: true })
      fetcher()
      commit('setChatListFetcher', {
        fetcher: () => promiseInterval(fetcher, 5000)
      })
    },
    stopFetchingChats ({ commit }) {
      commit('setChatListFetcher', { fetcher: undefined })
    },
    fetchChats ({ dispatch, rootState, commit }, params = {}) {
      return rootState.api.backendInteractor.chats()
        .then(({ chats }) => {
          dispatch('addNewChats', { chats })
          return chats
        })
    },
    addNewChats (store, { chats }) {
      const { commit, dispatch, rootGetters } = store
      const newChatMessageSideEffects = (chat) => {
        maybeShowChatNotification(store, chat)
      }
      commit('addNewChats', { dispatch, chats, rootGetters, newChatMessageSideEffects })
    },
    updateChat ({ commit }, { chat }) {
      commit('updateChat', { chat })
    },

    // Opened Chats
    startFetchingCurrentChat ({ commit, dispatch }, { fetcher }) {
      dispatch('setCurrentChatFetcher', { fetcher })
    },
    setCurrentChatFetcher ({ rootState, commit }, { fetcher }) {
      commit('setCurrentChatFetcher', { fetcher })
    },
    addOpenedChat ({ rootState, commit, dispatch }, { chat }) {
      commit('addOpenedChat', { dispatch, chat: parseChat(chat) })
      dispatch('addNewUsers', [chat.account])
    },
    addChatMessages ({ commit }, value) {
      commit('addChatMessages', { commit, ...value })
    },
    resetChatNewMessageCount ({ commit }, value) {
      commit('resetChatNewMessageCount', value)
    },
    clearCurrentChat ({ rootState, commit, dispatch }, value) {
      commit('setCurrentChatId', { chatId: undefined })
      commit('setCurrentChatFetcher', { fetcher: undefined })
    },
    readChat ({ rootState, commit, dispatch }, { id, lastReadId }) {
      dispatch('resetChatNewMessageCount')
      commit('readChat', { id })
      rootState.api.backendInteractor.readChat({ id, lastReadId })
    },
    deleteChatMessage ({ rootState, commit }, value) {
      rootState.api.backendInteractor.deleteChatMessage(value)
      commit('deleteChatMessage', { commit, ...value })
    },
    resetChats ({ commit, dispatch }) {
      dispatch('clearCurrentChat')
      commit('resetChats', { commit })
    },
    clearOpenedChats ({ rootState, commit, dispatch, rootGetters }) {
      commit('clearOpenedChats', { commit })
    }
  },
  mutations: {
    setChatListFetcher (state, { commit, fetcher }) {
      const prevFetcher = state.chatListFetcher
      if (prevFetcher) {
        prevFetcher.stop()
      }
      state.chatListFetcher = fetcher && fetcher()
    },
    setCurrentChatFetcher (state, { fetcher }) {
      const prevFetcher = state.fetcher
      if (prevFetcher) {
        prevFetcher.stop()
      }
      state.fetcher = fetcher && fetcher()
    },
    addOpenedChat (state, { _dispatch, chat }) {
      state.currentChatId = chat.id
      Vue.set(state.openedChats, chat.id, chat)

      if (!state.openedChatMessageServices[chat.id]) {
        Vue.set(state.openedChatMessageServices, chat.id, chatService.empty(chat.id))
      }
    },
    setCurrentChatId (state, { chatId }) {
      state.currentChatId = chatId
    },
    addNewChats (state, { chats, newChatMessageSideEffects }) {
      chats.forEach((updatedChat) => {
        const chat = getChatById(state, updatedChat.id)

        if (chat) {
          const isNewMessage = (chat.lastMessage && chat.lastMessage.id) !== (updatedChat.lastMessage && updatedChat.lastMessage.id)
          chat.lastMessage = updatedChat.lastMessage
          chat.unread = updatedChat.unread
          chat.updated_at = updatedChat.updated_at
          if (isNewMessage && chat.unread) {
            newChatMessageSideEffects(updatedChat)
          }
        } else {
          state.chatList.data.push(updatedChat)
          Vue.set(state.chatList.idStore, updatedChat.id, updatedChat)
        }
      })
    },
    updateChat (state, { _dispatch, chat: updatedChat, _rootGetters }) {
      const chat = getChatById(state, updatedChat.id)
      if (chat) {
        chat.lastMessage = updatedChat.lastMessage
        chat.unread = updatedChat.unread
        chat.updated_at = updatedChat.updated_at
      }
      if (!chat) { state.chatList.data.unshift(updatedChat) }
      Vue.set(state.chatList.idStore, updatedChat.id, updatedChat)
    },
    deleteChat (state, { _dispatch, id, _rootGetters }) {
      state.chats.data = state.chats.data.filter(conversation =>
        conversation.last_status.id !== id
      )
      state.chats.idStore = omitBy(state.chats.idStore, conversation => conversation.last_status.id === id)
    },
    resetChats (state, { commit }) {
      state.chatList = emptyChatList()
      state.currentChatId = null
      commit('setChatListFetcher', { fetcher: undefined })
      for (const chatId in state.openedChats) {
        chatService.clear(state.openedChatMessageServices[chatId])
        Vue.delete(state.openedChats, chatId)
        Vue.delete(state.openedChatMessageServices, chatId)
      }
    },
    setChatsLoading (state, { value }) {
      state.chats.loading = value
    },
    addChatMessages (state, { chatId, messages, updateMaxId }) {
      const chatMessageService = state.openedChatMessageServices[chatId]
      if (chatMessageService) {
        chatService.add(chatMessageService, { messages: messages.map(parseChatMessage), updateMaxId })
      }
    },
    deleteChatMessage (state, { chatId, messageId }) {
      const chatMessageService = state.openedChatMessageServices[chatId]
      if (chatMessageService) {
        chatService.deleteMessage(chatMessageService, messageId)
      }
    },
    resetChatNewMessageCount (state, _value) {
      const chatMessageService = state.openedChatMessageServices[state.currentChatId]
      chatService.resetNewMessageCount(chatMessageService)
    },
    // Used when a connection loss occurs
    clearOpenedChats (state) {
      const currentChatId = state.currentChatId
      for (const chatId in state.openedChats) {
        if (currentChatId !== chatId) {
          chatService.clear(state.openedChatMessageServices[chatId])
          Vue.delete(state.openedChats, chatId)
          Vue.delete(state.openedChatMessageServices, chatId)
        }
      }
    },
    readChat (state, { id }) {
      const chat = getChatById(state, id)
      if (chat) {
        chat.unread = 0
      }
    }
  }
}

export default chats
