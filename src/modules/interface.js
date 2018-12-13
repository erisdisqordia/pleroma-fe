import { set, delete as del } from 'vue'

const defaultState = {
  settings: {
    currentSaveStateNotice: null,
    noticeClearTimeout: null,
    notificationPermission: null
  },
  browserSupport: {
    cssFilter: window.CSS && window.CSS.supports && (
      window.CSS.supports('filter', 'drop-shadow(0 0)') ||
      window.CSS.supports('-webkit-filter', 'drop-shadow(0 0)')
    )
  }
}

const interfaceMod = {
  state: defaultState,
  mutations: {
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
    },
    setNotificationPermission (state, permission) {
      state.notificationPermission = permission
    }
  },
  actions: {
    setPageTitle ({ rootState }, option = '') {
      document.title = `${option} ${rootState.instance.name}`
    },
    settingsSaved ({ commit, dispatch }, { success, error }) {
      commit('settingsSaved', { success, error })
    },
    setNotificationPermission ({ commit }, permission) {
      commit('setNotificationPermission', permission)
    }
  }
}

export default interfaceMod
