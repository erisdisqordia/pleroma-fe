import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import App from '../App.vue'
import { windowWidth } from '../services/window_utils/window_utils'
import { getOrCreateApp, getClientToken } from '../services/new_api/oauth.js'
import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import { CURRENT_VERSION } from '../services/theme_data/theme_data.service.js'
import { applyTheme } from '../services/style_setter/style_setter.js'

let staticInitialResults = null

const parsedInitialResults = () => {
  if (!document.getElementById('initial-results')) {
    return null
  }
  if (!staticInitialResults) {
    staticInitialResults = JSON.parse(document.getElementById('initial-results').textContent)
  }
  return staticInitialResults
}

const decodeUTF8Base64 = (data) => {
  const rawData = atob(data)
  const array = Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
  const text = new TextDecoder().decode(array)
  return text
}

const preloadFetch = async (request) => {
  const data = parsedInitialResults()
  if (!data || !data[request]) {
    return window.fetch(request)
  }
  const decoded = decodeUTF8Base64(data[request])
  const requestData = JSON.parse(decoded)
  return {
    ok: true,
    json: () => requestData,
    text: () => requestData
  }
}

const getInstanceConfig = async ({ store }) => {
  try {
    const res = await preloadFetch('/api/v1/instance')
    if (res.ok) {
      const data = await res.json()
      const textlimit = data.max_toot_chars
      const vapidPublicKey = data.pleroma.vapid_public_key

      store.dispatch('setInstanceOption', { name: 'textlimit', value: textlimit })

      if (vapidPublicKey) {
        store.dispatch('setInstanceOption', { name: 'vapidPublicKey', value: vapidPublicKey })
      }
    } else {
      throw (res)
    }
  } catch (error) {
    console.error('Could not load instance config, potentially fatal')
    console.error(error)
  }
}

const getBackendProvidedConfig = async ({ store }) => {
  try {
    const res = await window.fetch('/api/pleroma/frontend_configurations')
    if (res.ok) {
      const data = await res.json()
      return data.pleroma_fe
    } else {
      throw (res)
    }
  } catch (error) {
    console.error('Could not load backend-provided frontend config, potentially fatal')
    console.error(error)
  }
}

const getStaticConfig = async () => {
  try {
    const res = await window.fetch('/static/config.json')
    if (res.ok) {
      return res.json()
    } else {
      throw (res)
    }
  } catch (error) {
    console.warn('Failed to load static/config.json, continuing without it.')
    console.warn(error)
    return {}
  }
}

const setSettings = async ({ apiConfig, staticConfig, store }) => {
  const overrides = window.___pleromafe_dev_overrides || {}
  const env = window.___pleromafe_mode.NODE_ENV

  // This takes static config and overrides properties that are present in apiConfig
  let config = {}
  if (overrides.staticConfigPreference && env === 'development') {
    console.warn('OVERRIDING API CONFIG WITH STATIC CONFIG')
    config = Object.assign({}, apiConfig, staticConfig)
  } else {
    config = Object.assign({}, staticConfig, apiConfig)
  }

  const copyInstanceOption = (name) => {
    store.dispatch('setInstanceOption', { name, value: config[name] })
  }

  copyInstanceOption('nsfwCensorImage')
  copyInstanceOption('background')
  copyInstanceOption('hidePostStats')
  copyInstanceOption('hideUserStats')
  copyInstanceOption('hideFilteredStatuses')
  copyInstanceOption('logo')

  store.dispatch('setInstanceOption', {
    name: 'logoMask',
    value: typeof config.logoMask === 'undefined'
      ? true
      : config.logoMask
  })

  store.dispatch('setInstanceOption', {
    name: 'logoMargin',
    value: typeof config.logoMargin === 'undefined'
      ? 0
      : config.logoMargin
  })
  store.commit('authFlow/setInitialStrategy', config.loginMethod)

  copyInstanceOption('redirectRootNoLogin')
  copyInstanceOption('redirectRootLogin')
  copyInstanceOption('showInstanceSpecificPanel')
  copyInstanceOption('minimalScopesMode')
  copyInstanceOption('hideMutedPosts')
  copyInstanceOption('collapseMessageWithSubject')
  copyInstanceOption('scopeCopy')
  copyInstanceOption('subjectLineBehavior')
  copyInstanceOption('postContentType')
  copyInstanceOption('alwaysShowSubjectInput')
  copyInstanceOption('showFeaturesPanel')
  copyInstanceOption('hideSitename')
  copyInstanceOption('sidebarRight')

  return store.dispatch('setTheme', config['theme'])
}

const getTOS = async ({ store }) => {
  try {
    const res = await window.fetch('/static/terms-of-service.html')
    if (res.ok) {
      const html = await res.text()
      store.dispatch('setInstanceOption', { name: 'tos', value: html })
    } else {
      throw (res)
    }
  } catch (e) {
    console.warn("Can't load TOS")
    console.warn(e)
  }
}

const getInstancePanel = async ({ store }) => {
  try {
    const res = await preloadFetch('/instance/panel.html')
    if (res.ok) {
      const html = await res.text()
      store.dispatch('setInstanceOption', { name: 'instanceSpecificPanelContent', value: html })
    } else {
      throw (res)
    }
  } catch (e) {
    console.warn("Can't load instance panel")
    console.warn(e)
  }
}

const getStickers = async ({ store }) => {
  try {
    const res = await window.fetch('/static/stickers.json')
    if (res.ok) {
      const values = await res.json()
      const stickers = (await Promise.all(
        Object.entries(values).map(async ([name, path]) => {
          const resPack = await window.fetch(path + 'pack.json')
          var meta = {}
          if (resPack.ok) {
            meta = await resPack.json()
          }
          return {
            pack: name,
            path,
            meta
          }
        })
      )).sort((a, b) => {
        return a.meta.title.localeCompare(b.meta.title)
      })
      store.dispatch('setInstanceOption', { name: 'stickers', value: stickers })
    } else {
      throw (res)
    }
  } catch (e) {
    console.warn("Can't load stickers")
    console.warn(e)
  }
}

const getAppSecret = async ({ store }) => {
  const { state, commit } = store
  const { oauth, instance } = state
  return getOrCreateApp({ ...oauth, instance: instance.server, commit })
    .then((app) => getClientToken({ ...app, instance: instance.server }))
    .then((token) => {
      commit('setAppToken', token.access_token)
      commit('setBackendInteractor', backendInteractorService(store.getters.getToken()))
    })
}

const resolveStaffAccounts = ({ store, accounts }) => {
  const nicknames = accounts.map(uri => uri.split('/').pop())
  store.dispatch('setInstanceOption', { name: 'staffAccounts', value: nicknames })
}

const getNodeInfo = async ({ store }) => {
  try {
    const res = await preloadFetch('/nodeinfo/2.0.json')
    if (res.ok) {
      const data = await res.json()
      const metadata = data.metadata
      const features = metadata.features
      store.dispatch('setInstanceOption', { name: 'name', value: metadata.nodeName })
      store.dispatch('setInstanceOption', { name: 'registrationOpen', value: data.openRegistrations })
      store.dispatch('setInstanceOption', { name: 'mediaProxyAvailable', value: features.includes('media_proxy') })
      store.dispatch('setInstanceOption', { name: 'safeDM', value: features.includes('safe_dm_mentions') })
      store.dispatch('setInstanceOption', { name: 'chatAvailable', value: features.includes('chat') })
      store.dispatch('setInstanceOption', { name: 'gopherAvailable', value: features.includes('gopher') })
      store.dispatch('setInstanceOption', { name: 'pollsAvailable', value: features.includes('polls') })
      store.dispatch('setInstanceOption', { name: 'pollLimits', value: metadata.pollLimits })
      store.dispatch('setInstanceOption', { name: 'mailerEnabled', value: metadata.mailerEnabled })

      const uploadLimits = metadata.uploadLimits
      store.dispatch('setInstanceOption', { name: 'uploadlimit', value: parseInt(uploadLimits.general) })
      store.dispatch('setInstanceOption', { name: 'avatarlimit', value: parseInt(uploadLimits.avatar) })
      store.dispatch('setInstanceOption', { name: 'backgroundlimit', value: parseInt(uploadLimits.background) })
      store.dispatch('setInstanceOption', { name: 'bannerlimit', value: parseInt(uploadLimits.banner) })
      store.dispatch('setInstanceOption', { name: 'fieldsLimits', value: metadata.fieldsLimits })

      store.dispatch('setInstanceOption', { name: 'restrictedNicknames', value: metadata.restrictedNicknames })
      store.dispatch('setInstanceOption', { name: 'postFormats', value: metadata.postFormats })

      const suggestions = metadata.suggestions
      store.dispatch('setInstanceOption', { name: 'suggestionsEnabled', value: suggestions.enabled })
      store.dispatch('setInstanceOption', { name: 'suggestionsWeb', value: suggestions.web })

      const software = data.software
      store.dispatch('setInstanceOption', { name: 'backendVersion', value: software.version })
      store.dispatch('setInstanceOption', { name: 'pleromaBackend', value: software.name === 'pleroma' })

      const priv = metadata.private
      store.dispatch('setInstanceOption', { name: 'private', value: priv })

      const frontendVersion = window.___pleromafe_commit_hash
      store.dispatch('setInstanceOption', { name: 'frontendVersion', value: frontendVersion })

      const federation = metadata.federation

      store.dispatch('setInstanceOption', {
        name: 'tagPolicyAvailable',
        value: typeof federation.mrf_policies === 'undefined'
          ? false
          : metadata.federation.mrf_policies.includes('TagPolicy')
      })

      store.dispatch('setInstanceOption', { name: 'federationPolicy', value: federation })
      store.dispatch('setInstanceOption', {
        name: 'federating',
        value: typeof federation.enabled === 'undefined'
          ? true
          : federation.enabled
      })

      const accountActivationRequired = metadata.accountActivationRequired
      store.dispatch('setInstanceOption', { name: 'accountActivationRequired', value: accountActivationRequired })

      const accounts = metadata.staffAccounts
      resolveStaffAccounts({ store, accounts })
    } else {
      throw (res)
    }
  } catch (e) {
    console.warn('Could not load nodeinfo')
    console.warn(e)
  }
}

const setConfig = async ({ store }) => {
  // apiConfig, staticConfig
  const configInfos = await Promise.all([getBackendProvidedConfig({ store }), getStaticConfig()])
  const apiConfig = configInfos[0]
  const staticConfig = configInfos[1]

  await setSettings({ store, apiConfig, staticConfig }).then(getAppSecret({ store }))
}

const checkOAuthToken = async ({ store }) => {
  return new Promise(async (resolve, reject) => {
    if (store.getters.getUserToken()) {
      try {
        await store.dispatch('loginUser', store.getters.getUserToken())
      } catch (e) {
        console.error(e)
      }
    }
    resolve()
  })
}

const afterStoreSetup = async ({ store, i18n }) => {
  const width = windowWidth()
  store.dispatch('setMobileLayout', width <= 800)

  const overrides = window.___pleromafe_dev_overrides || {}
  const server = (typeof overrides.target !== 'undefined') ? overrides.target : window.location.origin
  store.dispatch('setInstanceOption', { name: 'server', value: server })

  await setConfig({ store })

  const { customTheme, customThemeSource } = store.state.config
  const { theme } = store.state.instance
  const customThemePresent = customThemeSource || customTheme

  if (customThemePresent) {
    if (customThemeSource && customThemeSource.themeEngineVersion === CURRENT_VERSION) {
      applyTheme(customThemeSource)
    } else {
      applyTheme(customTheme)
    }
  } else if (theme) {
    // do nothing, it will load asynchronously
  } else {
    console.error('Failed to load any theme!')
  }

  // Now we can try getting the server settings and logging in
  // Most of these are preloaded into the index.html so blocking is minimized
  await Promise.all([
    checkOAuthToken({ store }),
    getInstancePanel({ store }),
    getNodeInfo({ store }),
    getInstanceConfig({ store })
  ])

  // Start fetching things that don't need to block the UI
  store.dispatch('fetchMutes')
  getTOS({ store })
  getStickers({ store })

  const router = new VueRouter({
    mode: 'history',
    routes: routes(store),
    scrollBehavior: (to, _from, savedPosition) => {
      if (to.matched.some(m => m.meta.dontScroll)) {
        return false
      }
      return savedPosition || { x: 0, y: 0 }
    }
  })

  /* eslint-disable no-new */
  return new Vue({
    router,
    store,
    i18n,
    el: '#app',
    render: h => h(App)
  })
}

export default afterStoreSetup
