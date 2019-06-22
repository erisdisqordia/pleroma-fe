const chat = {
  state: {
    messages: [],
    channel: {state: ''},
    socket: null
  },
  mutations: {
    setChannel (state, channel) {
      state.channel = channel
    },
    setSocket (state, socket) {
      state.socket = socket
    },
    addMessage (state, message) {
      state.messages.push(message)
      state.messages = state.messages.slice(-19, 20)
    },
    setMessages (state, messages) {
      state.messages = messages.slice(-19, 20)
    }
  },
  actions: {
    disconnectFromChat (store) {
      store.state.socket && store.state.socket.disconnect()
    },
    initializeChat (store, socket) {
      const channel = socket.channel('chat:public')
      store.commit('setSocket', socket)
      channel.on('new_msg', (msg) => {
        store.commit('addMessage', msg)
      })
      channel.on('messages', ({messages}) => {
        store.commit('setMessages', messages)
      })
      channel.join()
      store.commit('setChannel', channel)
    }
  }
}

export default chat
