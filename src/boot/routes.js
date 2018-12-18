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
                : store.state.instance.redirectRootNoLogin) || '/~/main/all'
      }
    },
    { name: 'public-external-timeline', path: '/~/main/all', component: PublicAndExternalTimeline },
    { name: 'public-timeline', path: '/~/main/public', component: PublicTimeline },
    { name: 'friends', path: '/~/main/friends', component: FriendsTimeline },
    // Beginning of temporary redirects
    { path: '/main/:route',
      redirect: to => {
        const { params } = to
        const route = params.route ? params.route : 'all'

        return { path: `/~/main/${route}` }
      }
    },
    { path: '/tag/:tag',
      redirect: to => {
        const { params } = to

        return { path: `/~/tag/${params.tag}` }
      }
    },
    { path: '/notice/:id',
      redirect: to => {
        const { params } = to

        return { path: `/~/notice/${params.id}` }
      }
    },
    // End of temporary redirects
    { name: 'tag-timeline', path: '/~/tag/:tag', component: TagTimeline },
    { name: 'conversation', path: '/~/notice/:id', component: ConversationPage, meta: { dontScroll: true } },
    { name: 'user-profile', path: '/:name', component: UserProfile },
    { name: 'external-user-profile', path: '/~/users/:id', component: UserProfile },
    { name: 'mentions', path: '/:username/mentions', component: Mentions },
    { name: 'dms', path: '/:username/dms', component: DMs },
    { name: 'settings', path: '/~/settings', component: Settings },
    { name: 'registration', path: '/~/registration', component: Registration },
    { name: 'registration', path: '/~/registration/:token', component: Registration },
    { name: 'friend-requests', path: '/~/friend-requests', component: FollowRequests },
    { name: 'user-settings', path: '/~/user-settings', component: UserSettings },
    { name: 'oauth-callback', path: '/~/oauth-callback', component: OAuthCallback, props: (route) => ({ code: route.query.code }) },
    { name: 'user-search', path: '/~/user-search', component: UserSearch, props: (route) => ({ query: route.query.query }) }
  ]
}
