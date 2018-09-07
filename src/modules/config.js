import { set, delete as del } from 'vue'
import StyleSetter from '../services/style_setter/style_setter.js'

const browserLocale = (window.navigator.language || 'en').split('-')[0]

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
  notificationVisibility: {
    follows: true,
    mentions: true,
    likes: true,
    repeats: true
  },
  muteWords: [],
  highlight: {},
  interfaceLanguage: browserLocale,
  _internal: {
    currentSaveStateNotice: {},
    noticeClearTimeout: null
  }
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
    },
    settingsSaved (state, { success, error }) {
      if (success) {
        if (state.noticeClearTimeout) {
          clearTimeout(state.noticeClearTimeout)
        }
        set(state._internal, 'currentSaveStateNotice', { error: false, data: success })
        set(state._internal, 'noticeClearTimeout',
            setTimeout(() => del(state._internal, 'currentSaveStateNotice'), 2000))
      } else {
        set(state._internal, 'currentSaveStateNotice', { error: true, errorData: error })
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
    settingsSaved ({ commit, dispatch }, { success, error }) {
      commit('settingsSaved', { success, error })
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
