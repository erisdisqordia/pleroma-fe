import PublicTimeline from 'components/public_timeline/public_timeline.vue'
import PublicAndExternalTimeline from 'components/public_and_external_timeline/public_and_external_timeline.vue'
import FriendsTimeline from 'components/friends_timeline/friends_timeline.vue'
import TagTimeline from 'components/tag_timeline/tag_timeline.vue'
import ConversationPage from 'components/conversation-page/conversation-page.vue'
import Mentions from 'components/mentions/mentions.vue'
import DMs from 'components/dm_timeline/dm_timeline.vue'
import UserProfile from 'components/user_profile/user_profile.vue'
import Settings from 'components/settings/settings.vue'
import Registration from 'components/registration/registration.vue'
import UserSettings from 'components/user_settings/user_settings.vue'
import FollowRequests from 'components/follow_requests/follow_requests.vue'
import OAuthCallback from 'components/oauth_callback/oauth_callback.vue'
import UserSearch from 'components/user_search/user_search.vue'
import Notifications from 'components/notifications/notifications.vue'
import UserPanel from 'components/user_panel/user_panel.vue'
import LoginForm from 'components/login_form/login_form.vue'
import ChatPanel from 'components/chat_panel/chat_panel.vue'
import WhoToFollow from 'components/who_to_follow/who_to_follow.vue'
import About from 'components/about/about.vue'

export default (store) => {
  return [
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
    { name: 'friends', path: '/main/friends', component: FriendsTimeline },
    { name: 'tag-timeline', path: '/tag/:tag', component: TagTimeline },
    { name: 'conversation', path: '/notice/:id', component: ConversationPage, meta: { dontScroll: true } },
    { name: 'external-user-profile', path: '/users/:id', component: UserProfile },
    { name: 'mentions', path: '/users/:username/mentions', component: Mentions },
    { name: 'dms', path: '/users/:username/dms', component: DMs },
    { name: 'settings', path: '/settings', component: Settings },
    { name: 'registration', path: '/registration', component: Registration },
    { name: 'registration-token', path: '/registration/:token', component: Registration },
    { name: 'friend-requests', path: '/friend-requests', component: FollowRequests },
    { name: 'user-settings', path: '/user-settings', component: UserSettings },
    { name: 'notifications', path: '/:username/notifications', component: Notifications },
    { name: 'new-status', path: '/:username/new-status', component: UserPanel },
    { name: 'login', path: '/login', component: LoginForm },
    { name: 'chat', path: '/chat', component: ChatPanel, props: () => ({ floating: false }) },
    { name: 'oauth-callback', path: '/oauth-callback', component: OAuthCallback, props: (route) => ({ code: route.query.code }) },
    { name: 'user-search', path: '/user-search', component: UserSearch, props: (route) => ({ query: route.query.query }) },
    { name: 'who-to-follow', path: '/who-to-follow', component: WhoToFollow },
    { name: 'about', path: '/about', component: About },
    { name: 'user-profile', path: '/(users/)?:name', component: UserProfile }
  ]
}
