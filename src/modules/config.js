import { set } from 'vue'
import StyleSetter from '../services/style_setter/style_setter.js'

const defaultState = {
  name: 'Pleroma FE'
}

const config = {
  state: defaultState,
  mutations: {
    setOption (state, { name, value }) {
      set(state, name, value)
    }
  },
  actions: {
    setOption ({ commit }, { name, value }) {
      commit('setOption', {name, value})
      switch (name) {
        case 'name':
          document.title = value
          break
        case 'theme':
          const fullPath = `/static/css/${value}`
          StyleSetter.setStyle(fullPath)
      }
    }
  }
}

export default config
