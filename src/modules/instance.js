import { set } from 'vue'
import StyleSetter from '../services/style_setter/style_setter.js'

const defaultState = {
  // Stuff from static/config.json and apiConfig
  name: 'Pleroma FE',
  registrationOpen: true,
  textlimit: 5000,
  server: 'http://localhost:4040/',
  theme: 'pleroma-dark',
  background: '/static/aurora_borealis.jpg',
  logo: '/static/logo.png',
  logoMask: true,
  logoMargin: '.2em',
  redirectRootNoLogin: '/main/all',
  redirectRootLogin: '/main/friends',
  showInstanceSpecificPanel: false,
  scopeOptionsEnabled: true,
  formattingOptionsEnabled: false,
  collapseMessageWithSubject: false,
  hidePostStats: false,
  hideUserStats: false,
  disableChat: false,

  // Nasty stuff
  pleromaBackend: true,
  emoji: [],
  customEmoji: [],

  // Feature-set, apparently, not everything here is reported...
  mediaProxyAvailable: false,
  chatAvailable: false,
  gopherAvailable: false,
  suggestionsEnabled: false,
  suggestionsWeb: '',

  // Html stuff
  instanceSpecificPanelContent: '',
  tos: ''
}

const instance = {
  state: defaultState,
  mutations: {
    setInstanceOption (state, { name, value }) {
      if (typeof value !== 'undefined') {
        set(state, name, value)
      }
    }
  },
  actions: {
    setInstanceOption ({ commit, dispatch }, { name, value }) {
      commit('setInstanceOption', {name, value})
      switch (name) {
        case 'name':
          dispatch('setPageTitle')
          break
        case 'theme':
          StyleSetter.setPreset(value, commit)
      }
    }
  }
}

export default instance
