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

export default (store) => {
  return [
    { name: 'root',
      path: '/',
      redirect: _to => {
        return (store.state.users.currentUser
                ? store.state.instance.redirectRootLogin
                : store.state.instance.redirectRootNoLogin) || '/p/main/all'
      }
    },
    { name: 'public-external-timeline', path: '/p/main/all', component: PublicAndExternalTimeline },
    { name: 'public-timeline', path: '/p/main/public', component: PublicTimeline },
    { name: 'friends', path: '/p/main/friends', component: FriendsTimeline },
    { name: 'tag-timeline', path: '/p/tag/:tag', component: TagTimeline },
    { name: 'conversation', path: '/p/notice/:id', component: ConversationPage, meta: { dontScroll: true } },
    { name: 'user-profile', path: '/:name', component: UserProfile },
    { name: 'mentions', path: '/:username/mentions', component: Mentions },
    { name: 'dms', path: '/:username/dms', component: DMs },
    { name: 'settings', path: '/p/settings', component: Settings },
    { name: 'registration', path: '/p/registration', component: Registration },
    { name: 'registration', path: '/p/registration/:token', component: Registration },
    { name: 'friend-requests', path: '/p/friend-requests', component: FollowRequests },
    { name: 'user-settings', path: '/p/user-settings', component: UserSettings },
    { name: 'oauth-callback', path: '/p/oauth-callback', component: OAuthCallback, props: (route) => ({ code: route.query.code }) },
    { name: 'user-search', path: '/p/user-search', component: UserSearch, props: (route) => ({ query: route.query.query }) }
  ]
}
