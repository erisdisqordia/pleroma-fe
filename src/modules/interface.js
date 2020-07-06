import { set, delete as del } from 'vue'

const defaultState = {
  settingsModalState: 'hidden',
  settingsModalLoaded: false,
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
  },
  mobileLayout: false,
  globalNotices: []
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
    },
    setMobileLayout (state, value) {
      state.mobileLayout = value
    },
    closeSettingsModal (state) {
      state.settingsModalState = 'hidden'
    },
    togglePeekSettingsModal (state) {
      switch (state.settingsModalState) {
        case 'minimized':
          state.settingsModalState = 'visible'
          return
        case 'visible':
          state.settingsModalState = 'minimized'
          return
        default:
          throw new Error('Illegal minimization state of settings modal')
      }
    },
    openSettingsModal (state) {
      state.settingsModalState = 'visible'
      if (!state.settingsModalLoaded) {
        state.settingsModalLoaded = true
      }
    },
    pushGlobalNotice (state, notice) {
      state.globalNotices.push(notice)
    },
    removeGlobalNotice (state, notice) {
      state.globalNotices = state.globalNotices.filter(n => n !== notice)
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
    },
    setMobileLayout ({ commit }, value) {
      commit('setMobileLayout', value)
    },
    closeSettingsModal ({ commit }) {
      commit('closeSettingsModal')
    },
    openSettingsModal ({ commit }) {
      commit('openSettingsModal')
    },
    togglePeekSettingsModal ({ commit }) {
      commit('togglePeekSettingsModal')
    },
    pushGlobalNotice (
      { commit, dispatch },
      {
        messageKey,
        messageArgs = {},
        level = 'error',
        timeout = 0
      }) {
      const notice = {
        messageKey,
        messageArgs,
        level
      }
      if (timeout) {
        setTimeout(() => dispatch('removeGlobalNotice', notice), timeout)
      }
      commit('pushGlobalNotice', notice)
      return notice
    },
    removeGlobalNotice ({ commit }, notice) {
      commit('removeGlobalNotice', notice)
    }
  }
}

export default interfaceMod
