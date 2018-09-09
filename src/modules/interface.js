import { set, delete as del } from 'vue'

const defaultState = {
  name: 'Pleroma FE',
  registrationOpen: true,
  textlimit: 5000,
  server: 'http://localhost:4040/',
  settings: {
    currentSaveStateNotice: null,
    noticeClearTimeout: null
  }
}

const interfaceMod = {
  state: defaultState,
  mutations: {
    setInstanceOption (state, { name, value }) {
      console.log(state)
      console.log(name)
      set(state, name, value)
    },
    settingsSaved (state, { success, error }) {
      if (success) {
        if (state.noticeClearTimeout) {
          clearTimeout(state.noticeClearTimeout)
        }
        set(state.settings, 'currentSaveStateNotice', { error: false, data: success })
        set(state.settings, 'noticeClearTimeout',
            setTimeout(() => del(state.settings, 'currentSaveStateNotice'), 2000))
      } else {
        set(state.settings, 'currentSaveStateNotice', { error: true, errorData: error })
      }
    }
  },
  actions: {
    setPageTitle ({state}, option = '') {
      document.title = `${option} ${state.name}`
    },
    settingsSaved ({ commit, dispatch }, { success, error }) {
      commit('settingsSaved', { success, error })
    },
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

export default interfaceMod
