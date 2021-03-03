const chat = {
  state: {
    messages: [],
    channel: { state: '' }
  },
  mutations: {
    setChannel (state, channel) {
      state.channel = channel
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
    initializeChat (store, socket) {
      const channel = socket.channel('chat:public')
      let id = 0
      const createmsg = () => {
        id += 1
        return {
          text: 'test' + id,
          author: {
            username: 'test',
            avatar: '',
            id
          }
        }
      }

      const loop = () => {
        store.commit('addMessage', createmsg())
        setTimeout(loop, 3000)
      }
      loop()

      channel.on('new_msg', (msg) => {
        store.commit('addMessage', msg)
      })
      channel.on('messages', ({ messages }) => {
        store.commit('setMessages', messages)
      })
      channel.join()
      store.commit('setChannel', channel)
    }
  }
}

export default chat
