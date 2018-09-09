import { set } from 'vue'

const defaultState = {
  name: 'Pleroma FE',
  registrationOpen: true,
  textlimit: 5000,
  server: 'http://localhost:4040/',
  theme: 'pleroma-dark',
  background: 'img.png',
  logo: '/static/logo.png',
  logoMask: true,
  logoMargin: '.2em',
  redirectRootNoLogin: '/main/all',
  redirectRootLogin: '/main/friends',
  showInstanceSpecificPanel: false,
  scopeOptionsEnabled: true,
  formattingOptionsEnabled: false,
  collapseMessageWithSubject: false,
  disableChat: false,
  // Nasty stuff
  pleromaBackend: true,
  customEmoji: [],
  // Html stuff
  instanceSpecificPanelContent: '',
  tos: ''
}

const instance = {
  state: defaultState,
  mutations: {
    setInstanceOption (state, { name, value }) {
      set(state, name, value)
    }
  },
  actions: {
    setInstanceOption ({ commit, dispatch }, { name, value }) {
      commit('setInstanceOption', {name, value})
      switch (name) {
        case 'name':
          dispatch('setPageTitle')
          break
      }
    }
  }
}

export default instance
