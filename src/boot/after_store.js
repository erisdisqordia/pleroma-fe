import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '../App.vue'
import PublicTimeline from '../components/public_timeline/public_timeline.vue'
import PublicAndExternalTimeline from '../components/public_and_external_timeline/public_and_external_timeline.vue'
import FriendsTimeline from '../components/friends_timeline/friends_timeline.vue'
import TagTimeline from '../components/tag_timeline/tag_timeline.vue'
import ConversationPage from '../components/conversation-page/conversation-page.vue'
import Mentions from '../components/mentions/mentions.vue'
import UserProfile from '../components/user_profile/user_profile.vue'
import Settings from '../components/settings/settings.vue'
import Registration from '../components/registration/registration.vue'
import UserSettings from '../components/user_settings/user_settings.vue'
import FollowRequests from '../components/follow_requests/follow_requests.vue'
import OAuthCallback from '../components/oauth_callback/oauth_callback.vue'

const afterStoreSetup = ({store, i18n}) => {
  window.fetch('/api/statusnet/config.json')
    .then((res) => res.json())
    .then((data) => {
      const {name, closed: registrationClosed, textlimit, server} = data.site

      store.dispatch('setInstanceOption', { name: 'name', value: name })
      store.dispatch('setInstanceOption', { name: 'registrationOpen', value: (registrationClosed === '0') })
      store.dispatch('setInstanceOption', { name: 'textlimit', value: parseInt(textlimit) })
      store.dispatch('setInstanceOption', { name: 'server', value: server })

      var apiConfig = data.site.pleromafe

      window.fetch('/static/config.json')
        .then((res) => res.json())
        .catch((err) => {
          console.warn('Failed to load static/config.json, continuing without it.')
          console.warn(err)
          return {}
        })
        .then((staticConfig) => {
          // This takes static config and overrides properties that are present in apiConfig
          var config = Object.assign({}, staticConfig, apiConfig)

          var theme = (config.theme)
          var background = (config.background)
          var hidePostStats = (config.hidePostStats)
          var hideUserStats = (config.hideUserStats)
          var logo = (config.logo)
          var logoMask = (typeof config.logoMask === 'undefined' ? true : config.logoMask)
          var logoMargin = (typeof config.logoMargin === 'undefined' ? 0 : config.logoMargin)
          var redirectRootNoLogin = (config.redirectRootNoLogin)
          var redirectRootLogin = (config.redirectRootLogin)
          var chatDisabled = (config.chatDisabled)
          var showInstanceSpecificPanel = (config.showInstanceSpecificPanel)
          var scopeOptionsEnabled = (config.scopeOptionsEnabled)
          var formattingOptionsEnabled = (config.formattingOptionsEnabled)
          var collapseMessageWithSubject = (config.collapseMessageWithSubject)

          store.dispatch('setInstanceOption', { name: 'theme', value: theme })
          store.dispatch('setInstanceOption', { name: 'background', value: background })
          store.dispatch('setInstanceOption', { name: 'hidePostStats', value: hidePostStats })
          store.dispatch('setInstanceOption', { name: 'hideUserStats', value: hideUserStats })
          store.dispatch('setInstanceOption', { name: 'logo', value: logo })
          store.dispatch('setInstanceOption', { name: 'logoMask', value: logoMask })
          store.dispatch('setInstanceOption', { name: 'logoMargin', value: logoMargin })
          store.dispatch('setInstanceOption', { name: 'redirectRootNoLogin', value: redirectRootNoLogin })
          store.dispatch('setInstanceOption', { name: 'redirectRootLogin', value: redirectRootLogin })
          store.dispatch('setInstanceOption', { name: 'showInstanceSpecificPanel', value: showInstanceSpecificPanel })
          store.dispatch('setInstanceOption', { name: 'scopeOptionsEnabled', value: scopeOptionsEnabled })
          store.dispatch('setInstanceOption', { name: 'formattingOptionsEnabled', value: formattingOptionsEnabled })
          store.dispatch('setInstanceOption', { name: 'collapseMessageWithSubject', value: collapseMessageWithSubject })
          if (chatDisabled) {
            store.dispatch('disableChat')
          }

          const routes = [
            { name: 'root',
              path: '/',
              redirect: to => {
                return (store.state.users.currentUser
                        ? store.state.instance.redirectRootLogin
                        : store.state.instance.redirectRootNoLogin) || '/main/all'
              }},
            { path: '/main/all', component: PublicAndExternalTimeline },
            { path: '/main/public', component: PublicTimeline },
            { path: '/main/friends', component: FriendsTimeline },
            { path: '/tag/:tag', component: TagTimeline },
            { name: 'conversation', path: '/notice/:id', component: ConversationPage, meta: { dontScroll: true } },
            { name: 'user-profile', path: '/users/:id', component: UserProfile },
            { name: 'mentions', path: '/:username/mentions', component: Mentions },
            { name: 'settings', path: '/settings', component: Settings },
            { name: 'registration', path: '/registration', component: Registration },
            { name: 'registration', path: '/registration/:token', component: Registration },
            { name: 'friend-requests', path: '/friend-requests', component: FollowRequests },
            { name: 'user-settings', path: '/user-settings', component: UserSettings },
            { name: 'ouath-callback', path: '/oauth-callback', component: OAuthCallback, props: (route) => ({ code: route.query.code }) }
          ]

          const router = new VueRouter({
            mode: 'history',
            routes,
            scrollBehavior: (to, from, savedPosition) => {
              if (to.matched.some(m => m.meta.dontScroll)) {
                return false
              }
              return savedPosition || { x: 0, y: 0 }
            }
          })

          /* eslint-disable no-new */
          new Vue({
            router,
            store,
            i18n,
            el: '#app',
            render: h => h(App)
          })
        })
    })

  window.fetch('/static/terms-of-service.html')
    .then((res) => res.text())
    .then((html) => {
      store.dispatch('setInstanceOption', { name: 'tos', value: html })
    })

  window.fetch('/api/pleroma/emoji.json')
    .then(
      (res) => res.json()
        .then(
          (values) => {
            const emoji = Object.keys(values).map((key) => {
              return { shortcode: key, image_url: values[key] }
            })
            store.dispatch('setInstanceOption', { name: 'customEmoji', value: emoji })
            store.dispatch('setInstanceOption', { name: 'pleromaBackend', value: true })
          },
          (failure) => {
            store.dispatch('setInstanceOption', { name: 'pleromaBackend', value: false })
          }
        ),
      (error) => console.log(error)
    )

  window.fetch('/static/emoji.json')
    .then((res) => res.json())
    .then((values) => {
      const emoji = Object.keys(values).map((key) => {
        return { shortcode: key, image_url: false, 'utf': values[key] }
      })
      store.dispatch('setInstanceOption', { name: 'emoji', value: emoji })
    })

  window.fetch('/instance/panel.html')
    .then((res) => res.text())
    .then((html) => {
      store.dispatch('setInstanceOption', { name: 'instanceSpecificPanelContent', value: html })
    })

  window.fetch('/nodeinfo/2.0.json')
    .then((res) => res.json())
    .then((data) => {
      const metadata = data.metadata
      store.dispatch('setInstanceOption', { name: 'mediaProxyAvailable', value: data.metadata.mediaProxy })
      store.dispatch('setInstanceOption', { name: 'chatAvailable', value: data.metadata.chat })
      store.dispatch('setInstanceOption', { name: 'gopherAvailable', value: data.metadata.gopher })

      const suggestions = metadata.suggestions
      store.dispatch('setInstanceOption', { name: 'suggestionsEnabled', value: suggestions.enabled })
      store.dispatch('setInstanceOption', { name: 'suggestionsWeb', value: suggestions.web })
    })
}

export default afterStoreSetup
