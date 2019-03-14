import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

import App from '../App.vue'

const getStatusnetConfig = async ({ store }) => {
  try {
    const res = await window.fetch('/api/statusnet/config.json')
    if (res.ok) {
      const data = await res.json()
      const { name, closed: registrationClosed, textlimit, uploadlimit, server, vapidPublicKey } = data.site

      store.dispatch('setInstanceOption', { name: 'name', value: name })
      store.dispatch('setInstanceOption', { name: 'registrationOpen', value: (registrationClosed === '0') })
      store.dispatch('setInstanceOption', { name: 'textlimit', value: parseInt(textlimit) })
      store.dispatch('setInstanceOption', { name: 'server', value: server })

      // TODO: default values for this stuff, added if to not make it break on
      // my dev config out of the box.
      if (uploadlimit) {
        store.dispatch('setInstanceOption', { name: 'uploadlimit', value: parseInt(uploadlimit.uploadlimit) })
        store.dispatch('setInstanceOption', { name: 'avatarlimit', value: parseInt(uploadlimit.avatarlimit) })
        store.dispatch('setInstanceOption', { name: 'backgroundlimit', value: parseInt(uploadlimit.backgroundlimit) })
        store.dispatch('setInstanceOption', { name: 'bannerlimit', value: parseInt(uploadlimit.bannerlimit) })
      }

      if (vapidPublicKey) {
        store.dispatch('setInstanceOption', { name: 'vapidPublicKey', value: vapidPublicKey })
      }

      return data.site.pleromafe
    } else {
      throw (res)
    }
  } catch (error) {
    console.error('Could not load statusnet config, potentially fatal')
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

  copyInstanceOption('redirectRootNoLogin')
  copyInstanceOption('redirectRootLogin')
  copyInstanceOption('showInstanceSpecificPanel')
  copyInstanceOption('scopeOptionsEnabled')
  copyInstanceOption('formattingOptionsEnabled')
  copyInstanceOption('collapseMessageWithSubject')
  copyInstanceOption('loginMethod')
  copyInstanceOption('scopeCopy')
  copyInstanceOption('subjectLineBehavior')
  copyInstanceOption('postContentType')
  copyInstanceOption('alwaysShowSubjectInput')
  copyInstanceOption('noAttachmentLinks')
  copyInstanceOption('showFeaturesPanel')

  if ((config.chatDisabled)) {
    store.dispatch('disableChat')
  } else {
    store.dispatch('initializeSocket')
  }

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
    const res = await window.fetch('/instance/panel.html')
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

const getStaticEmoji = async ({ store }) => {
  try {
    const res = await window.fetch('/static/emoji.json')
    if (res.ok) {
      const values = await res.json()
      const emoji = Object.keys(values).map((key) => {
        return { shortcode: key, image_url: false, 'utf': values[key] }
      })
      store.dispatch('setInstanceOption', { name: 'emoji', value: emoji })
    } else {
      throw (res)
    }
  } catch (e) {
    console.warn("Can't load static emoji")
    console.warn(e)
  }
}

// This is also used to indicate if we have a 'pleroma backend' or not.
// Somewhat weird, should probably be somewhere else.
const getCustomEmoji = async ({ store }) => {
  try {
    const res = await window.fetch('/api/pleroma/emoji.json')
    if (res.ok) {
      const values = await res.json()
      const emoji = Object.keys(values).map((key) => {
        return { shortcode: key, image_url: values[key] }
      })
      store.dispatch('setInstanceOption', { name: 'customEmoji', value: emoji })
      store.dispatch('setInstanceOption', { name: 'pleromaBackend', value: true })
    } else {
      throw (res)
    }
  } catch (e) {
    store.dispatch('setInstanceOption', { name: 'pleromaBackend', value: false })
    console.warn("Can't load custom emojis, maybe not a Pleroma instance?")
    console.warn(e)
  }
}

const getNodeInfo = async ({ store }) => {
  try {
    const res = await window.fetch('/nodeinfo/2.0.json')
    if (res.ok) {
      const data = await res.json()
      const metadata = data.metadata

      const features = metadata.features
      store.dispatch('setInstanceOption', { name: 'mediaProxyAvailable', value: features.includes('media_proxy') })
      store.dispatch('setInstanceOption', { name: 'chatAvailable', value: features.includes('chat') })
      store.dispatch('setInstanceOption', { name: 'gopherAvailable', value: features.includes('gopher') })

      store.dispatch('setInstanceOption', { name: 'restrictedNicknames', value: metadata.restrictedNicknames })

      const suggestions = metadata.suggestions
      store.dispatch('setInstanceOption', { name: 'suggestionsEnabled', value: suggestions.enabled })
      store.dispatch('setInstanceOption', { name: 'suggestionsWeb', value: suggestions.web })
    } else {
      throw (res)
    }
  } catch (e) {
    console.warn('Could not load nodeinfo')
    console.warn(e)
  }
}

const afterStoreSetup = async ({ store, i18n }) => {
  const apiConfig = await getStatusnetConfig({ store })
  const staticConfig = await getStaticConfig()
  await setSettings({ store, apiConfig, staticConfig })
  await getTOS({ store })
  await getInstancePanel({ store })
  await getStaticEmoji({ store })
  await getCustomEmoji({ store })
  await getNodeInfo({ store })

  // Now we have the server settings and can try logging in
  if (store.state.oauth.token) {
    store.dispatch('loginUser', store.state.oauth.token)
  }

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
