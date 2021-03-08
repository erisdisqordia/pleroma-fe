import { set, delete as del } from 'vue'
import { setPreset, applyTheme } from '../services/style_setter/style_setter.js'
import messages from '../i18n/messages'

const browserLocale = (window.navigator.language || 'en').split('-')[0]

/* TODO this is a bit messy.
 * We need to declare settings with their types and also deal with
 * instance-default settings in some way, hopefully try to avoid copy-pasta
 * in general.
 */
export const multiChoiceProperties = [
  'postContentType',
  'subjectLineBehavior'
]

export const defaultState = {
  colors: {},
  theme: undefined,
  customTheme: undefined,
  customThemeSource: undefined,
  hideISP: false,
  hideInstanceWallpaper: false,
  // bad name: actually hides posts of muted USERS
  hideMutedPosts: undefined, // instance default
  collapseMessageWithSubject: undefined, // instance default
  padEmoji: true,
  hideAttachments: false,
  hideAttachmentsInConv: false,
  maxThumbnails: 16,
  hideNsfw: true,
  preloadImage: true,
  loopVideo: true,
  loopVideoSilentOnly: true,
  streaming: false,
  emojiReactionsOnTimeline: true,
  autohideFloatingPostButton: false,
  pauseOnUnfocused: true,
  stopGifs: false,
  replyVisibility: 'all',
  notificationVisibility: {
    follows: true,
    mentions: true,
    likes: true,
    repeats: true,
    moves: true,
    emojiReactions: false,
    followRequest: true,
    chatMention: true
  },
  webPushNotifications: false,
  muteWords: [],
  highlight: {},
  interfaceLanguage: browserLocale,
  hideScopeNotice: false,
  useStreamingApi: false,
  scopeCopy: undefined, // instance default
  subjectLineBehavior: undefined, // instance default
  alwaysShowSubjectInput: undefined, // instance default
  postContentType: undefined, // instance default
  minimalScopesMode: undefined, // instance default
  // This hides statuses filtered via a word filter
  hideFilteredStatuses: undefined, // instance default
  playVideosInModal: false,
  useOneClickNsfw: false,
  useContainFit: false,
  greentext: undefined, // instance default
  hidePostStats: undefined, // instance default
  hideUserStats: undefined, // instance default
  virtualScrolling: undefined, // instance default
  sensitiveByDefault: undefined // instance default
}

// caching the instance default properties
export const instanceDefaultProperties = Object.entries(defaultState)
  .filter(([key, value]) => value === undefined)
  .map(([key, value]) => key)

const config = {
  state: { ...defaultState },
  getters: {
    defaultConfig (state, getters, rootState, rootGetters) {
      const { instance } = rootState
      return {
        ...defaultState,
        ...Object.fromEntries(
          instanceDefaultProperties.map(key => [key, instance[key]])
        )
      }
    },
    mergedConfig (state, getters, rootState, rootGetters) {
      const { defaultConfig } = rootGetters
      return {
        ...defaultConfig,
        ...state
      }
    }
  },
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
    loadSettings ({ dispatch }, data) {
      const knownKeys = new Set(Object.keys(this.state.config))
      const presentKeys = new Set(Object.keys(data))
      const intersection = new Set()
      for (let elem of presentKeys) {
        if (knownKeys.has(elem)) {
          intersection.add(elem)
        }
      }

      Object.keys(intersection).forEach(
        name => dispatch('setOption', { name, value: data[name] })
      )
    },
    setHighlight ({ commit, dispatch }, { user, color, type }) {
      commit('setHighlight', { user, color, type })
    },
    setOption ({ commit, dispatch }, { name, value }) {
      commit('setOption', { name, value })
      switch (name) {
        case 'theme':
          setPreset(value)
          break
        case 'customTheme':
        case 'customThemeSource':
          applyTheme(value)
          break
        case 'interfaceLanguage':
          messages.setLanguage(this.getters.i18n, value)
          break
      }
    }
  }
}

export default config
