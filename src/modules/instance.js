import { set } from 'vue'
import { getPreset, applyTheme } from '../services/style_setter/style_setter.js'
import { CURRENT_VERSION } from '../services/theme_data/theme_data.service.js'
import apiService from '../services/api/api.service.js'
import { instanceDefaultProperties } from './config.js'

const defaultState = {
  // Stuff from apiConfig
  name: 'Pleroma FE',
  registrationOpen: true,
  server: 'http://localhost:4040/',
  textlimit: 5000,
  themeData: undefined,
  vapidPublicKey: undefined,

  // Stuff from static/config.json
  alwaysShowSubjectInput: true,
  defaultAvatar: '/images/avi.png',
  defaultBanner: '/images/banner.png',
  background: '/static/aurora_borealis.jpg',
  collapseMessageWithSubject: false,
  disableChat: false,
  greentext: false,
  hideFilteredStatuses: false,
  hideMutedPosts: false,
  hidePostStats: false,
  hideSitename: false,
  hideUserStats: false,
  loginMethod: 'password',
  logo: '/static/logo.png',
  logoMargin: '.2em',
  logoMask: true,
  minimalScopesMode: false,
  nsfwCensorImage: undefined,
  postContentType: 'text/plain',
  redirectRootLogin: '/main/friends',
  redirectRootNoLogin: '/main/all',
  scopeCopy: true,
  showFeaturesPanel: true,
  showInstanceSpecificPanel: false,
  sidebarRight: false,
  subjectLineBehavior: 'email',
  theme: 'pleroma-dark',

  // Nasty stuff
  customEmoji: [],
  customEmojiFetched: false,
  emoji: [],
  emojiFetched: false,
  pleromaBackend: true,
  postFormats: [],
  restrictedNicknames: [],
  safeDM: true,
  knownDomains: [],

  // Feature-set, apparently, not everything here is reported...
  chatAvailable: false,
  pleromaChatMessagesAvailable: false,
  gopherAvailable: false,
  mediaProxyAvailable: false,
  suggestionsEnabled: false,
  suggestionsWeb: '',

  // Html stuff
  instanceSpecificPanelContent: '',
  tos: '',

  // Version Information
  backendVersion: '',
  frontendVersion: '',

  pollsAvailable: false,
  pollLimits: {
    max_options: 4,
    max_option_chars: 255,
    min_expiration: 60,
    max_expiration: 60 * 60 * 24
  }
}

const instance = {
  state: defaultState,
  mutations: {
    setInstanceOption (state, { name, value }) {
      if (typeof value !== 'undefined') {
        set(state, name, value)
      }
    },
    setKnownDomains (state, domains) {
      state.knownDomains = domains
    }
  },
  getters: {
    instanceDefaultConfig (state) {
      return instanceDefaultProperties
        .map(key => [key, state[key]])
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    }
  },
  actions: {
    setInstanceOption ({ commit, dispatch }, { name, value }) {
      commit('setInstanceOption', { name, value })
      switch (name) {
        case 'name':
          dispatch('setPageTitle')
          break
        case 'chatAvailable':
          if (value) {
            dispatch('initializeSocket')
          }
          break
        case 'theme':
          dispatch('setTheme', value)
          break
      }
    },
    async getStaticEmoji ({ commit }) {
      try {
        const res = await window.fetch('/static/emoji.json')
        if (res.ok) {
          const values = await res.json()
          const emoji = Object.keys(values).map((key) => {
            return {
              displayText: key,
              imageUrl: false,
              replacement: values[key]
            }
          }).sort((a, b) => a.displayText - b.displayText)
          commit('setInstanceOption', { name: 'emoji', value: emoji })
        } else {
          throw (res)
        }
      } catch (e) {
        console.warn("Can't load static emoji")
        console.warn(e)
      }
    },

    async getCustomEmoji ({ commit, state }) {
      try {
        const res = await window.fetch('/api/pleroma/emoji.json')
        if (res.ok) {
          const result = await res.json()
          const values = Array.isArray(result) ? Object.assign({}, ...result) : result
          const emoji = Object.entries(values).map(([key, value]) => {
            const imageUrl = value.image_url
            return {
              displayText: key,
              imageUrl: imageUrl ? state.server + imageUrl : value,
              tags: imageUrl ? value.tags.sort((a, b) => a > b ? 1 : 0) : ['utf'],
              replacement: `:${key}: `
            }
            // Technically could use tags but those are kinda useless right now,
            // should have been "pack" field, that would be more useful
          }).sort((a, b) => a.displayText.toLowerCase() > b.displayText.toLowerCase() ? 1 : 0)
          commit('setInstanceOption', { name: 'customEmoji', value: emoji })
        } else {
          throw (res)
        }
      } catch (e) {
        console.warn("Can't load custom emojis")
        console.warn(e)
      }
    },

    setTheme ({ commit, rootState }, themeName) {
      commit('setInstanceOption', { name: 'theme', value: themeName })
      getPreset(themeName)
        .then(themeData => {
          commit('setInstanceOption', { name: 'themeData', value: themeData })
          // No need to apply theme if there's user theme already
          const { customTheme } = rootState.config
          if (customTheme) return

          // New theme presets don't have 'theme' property, they use 'source'
          const themeSource = themeData.source
          if (!themeData.theme || (themeSource && themeSource.themeEngineVersion === CURRENT_VERSION)) {
            applyTheme(themeSource)
          } else {
            applyTheme(themeData.theme)
          }
        })
    },
    fetchEmoji ({ dispatch, state }) {
      if (!state.customEmojiFetched) {
        state.customEmojiFetched = true
        dispatch('getCustomEmoji')
      }
      if (!state.emojiFetched) {
        state.emojiFetched = true
        dispatch('getStaticEmoji')
      }
    },

    async getKnownDomains ({ commit, rootState }) {
      try {
        const result = await apiService.fetchKnownDomains({
          credentials: rootState.users.currentUser.credentials
        })
        commit('setKnownDomains', result)
      } catch (e) {
        console.warn("Can't load known domains")
        console.warn(e)
      }
    }
  }
}

export default instance
