import { set, delete as del } from 'vue'
import StyleSetter from '../services/style_setter/style_setter.js'

const defaultState = {
  name: 'Pleroma FE',
  colors: {},
  collapseMessageWithSubject: false,
  hideAttachments: false,
  hideAttachmentsInConv: false,
  hideNsfw: true,
  loopVideo: true,
  loopVideoSilentOnly: true,
  autoLoad: true,
  streaming: false,
  hoverPreview: true,
  pauseOnUnfocused: true,
  stopGifs: false,
  replyVisibility: 'all',
  muteWords: [],
  highlight: {}
}

const config = {
  state: defaultState,
  mutations: {
    setOption (state, { name, value }) {
      set(state, name, value)
    },
    setHighlight (state, { user, color, type }) {
      const data = this.state.config.highlight[user]
      if (color || type) {
        set(state.highlight, user, { color: color || data.color, type: type || data.type })
      } else {
        del(state.highlight, user)
      }
    }
  },
  actions: {
    setPageTitle ({state}, option = '') {
      document.title = `${option} ${state.name}`
    },
    setHighlight ({ commit, dispatch }, { user, color, type }) {
      commit('setHighlight', {user, color, type})
    },
    setOption ({ commit, dispatch }, { name, value }) {
      commit('setOption', {name, value})
      switch (name) {
        case 'name':
          dispatch('setPageTitle')
          break
        case 'theme':
          StyleSetter.setPreset(value, commit)
          break
        case 'customTheme':
          StyleSetter.setColors(value, commit)
      }
    }
  }
}

export default config
