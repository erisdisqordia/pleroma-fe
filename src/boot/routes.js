import PublicTimeline from 'components/public_timeline/public_timeline.vue'
import PublicAndExternalTimeline from 'components/public_and_external_timeline/public_and_external_timeline.vue'
import FriendsTimeline from 'components/friends_timeline/friends_timeline.vue'
import TagTimeline from 'components/tag_timeline/tag_timeline.vue'
import BookmarkTimeline from 'components/bookmark_timeline/bookmark_timeline.vue'
import ConversationPage from 'components/conversation-page/conversation-page.vue'
import Interactions from 'components/interactions/interactions.vue'
import DMs from 'components/dm_timeline/dm_timeline.vue'
import ChatList from 'components/chat_list/chat_list.vue'
import Chat from 'components/chat/chat.vue'
import UserProfile from 'components/user_profile/user_profile.vue'
import Search from 'components/search/search.vue'
import Registration from 'components/registration/registration.vue'
import PasswordReset from 'components/password_reset/password_reset.vue'
import FollowRequests from 'components/follow_requests/follow_requests.vue'
import OAuthCallback from 'components/oauth_callback/oauth_callback.vue'
import Notifications from 'components/notifications/notifications.vue'
import AuthForm from 'components/auth_form/auth_form.js'
import ChatPanel from 'components/chat_panel/chat_panel.vue'
import WhoToFollow from 'components/who_to_follow/who_to_follow.vue'
import About from 'components/about/about.vue'
import RemoteUserResolver from 'components/remote_user_resolver/remote_user_resolver.vue'

export default (store) => {
  const validateAuthenticatedRoute = (to, from, next) => {
    if (store.state.users.currentUser) {
      next()
    } else {
      next(store.state.instance.redirectRootNoLogin || '/main/all')
    }
  }

  let routes = [
    { name: 'root',
      path: '/',
      redirect: _to => {
        return (store.state.users.currentUser
          ? store.state.instance.redirectRootLogin
          : store.state.instance.redirectRootNoLogin) || '/main/all'
      }
    },
    { name: 'public-external-timeline', path: '/main/all', component: PublicAndExternalTimeline },
    { name: 'public-timeline', path: '/main/public', component: PublicTimeline },
    { name: 'friends', path: '/main/friends', component: FriendsTimeline, beforeEnter: validateAuthenticatedRoute },
    { name: 'tag-timeline', path: '/tag/:tag', component: TagTimeline },
    { name: 'bookmarks', path: '/bookmarks', component: BookmarkTimeline },
    { name: 'conversation', path: '/notice/:id', component: ConversationPage, meta: { dontScroll: true } },
    { name: 'remote-user-profile-acct',
      path: '/remote-users/(@?):username([^/@]+)@:hostname([^/@]+)',
      component: RemoteUserResolver,
      beforeEnter: validateAuthenticatedRoute
    },
    { name: 'remote-user-profile',
      path: '/remote-users/:hostname/:username',
      component: RemoteUserResolver,
      beforeEnter: validateAuthenticatedRoute
    },
    { name: 'external-user-profile', path: '/users/:id', component: UserProfile },
    { name: 'interactions', path: '/users/:username/interactions', component: Interactions, beforeEnter: validateAuthenticatedRoute },
    { name: 'dms', path: '/users/:username/dms', component: DMs, beforeEnter: validateAuthenticatedRoute },
    { name: 'registration', path: '/registration', component: Registration },
    { name: 'password-reset', path: '/password-reset', component: PasswordReset, props: true },
    { name: 'registration-token', path: '/registration/:token', component: Registration },
    { name: 'friend-requests', path: '/friend-requests', component: FollowRequests, beforeEnter: validateAuthenticatedRoute },
    { name: 'notifications', path: '/:username/notifications', component: Notifications, beforeEnter: validateAuthenticatedRoute },
    { name: 'login', path: '/login', component: AuthForm },
    { name: 'chat-panel', path: '/chat-panel', component: ChatPanel, props: () => ({ floating: false }) },
    { name: 'oauth-callback', path: '/oauth-callback', component: OAuthCallback, props: (route) => ({ code: route.query.code }) },
    { name: 'search', path: '/search', component: Search, props: (route) => ({ query: route.query.query }) },
    { name: 'who-to-follow', path: '/who-to-follow', component: WhoToFollow, beforeEnter: validateAuthenticatedRoute },
    { name: 'about', path: '/about', component: About },
    { name: 'user-profile', path: '/(users/)?:name', component: UserProfile }
  ]

  if (store.state.instance.pleromaChatMessagesAvailable) {
    routes = routes.concat([
      { name: 'chat', path: '/users/:username/chats/:recipient_id', component: Chat, meta: { dontScroll: false }, beforeEnter: validateAuthenticatedRoute },
      { name: 'chats', path: '/users/:username/chats', component: ChatList, meta: { dontScroll: false }, beforeEnter: validateAuthenticatedRoute }
    ])
  }

  return routes
}
