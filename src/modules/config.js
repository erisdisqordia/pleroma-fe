import { set } from 'vue'
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
  muteWords: []
}

const config = {
  state: defaultState,
  mutations: {
    setOption (state, { name, value }) {
      set(state, name, value)
    }
  },
  actions: {
    setPageTitle ({state}, option = '') {
      document.title = `${option} ${state.name}`
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
