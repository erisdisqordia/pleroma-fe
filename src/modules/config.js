import { set, delete as del } from 'vue'
import StyleSetter from '../services/style_setter/style_setter.js'

const defaultState = {
  name: 'Pleroma FE',
  colors: {},
  hideAttachments: false,
  hideAttachmentsInConv: false,
  hideNsfw: true,
  autoLoad: true,
  streaming: false,
  hoverPreview: true,
  muteWords: [],
  highlight: {}
}

const config = {
  state: defaultState,
  mutations: {
    setOption (state, { name, value }) {
      set(state, name, value)
    },
    setHighlight (state, { user, color }) {
      if (color) {
        set(state.highlight, user, color)
      } else {
        del(state.highlight, user)
      }
    }
  },
  actions: {
    setPageTitle ({state}, option = '') {
      document.title = `${option} ${state.name}`
    },
    setHighlight ({ commit, dispatch }, { user, color }) {
      commit('setHighlight', {user, color})
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
