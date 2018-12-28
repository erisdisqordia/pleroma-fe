import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import UserProfile from 'src/components/user_profile/user_profile.vue'
import backendInteractorService from 'src/services/backend_interactor_service/backend_interactor_service.js'

const localVue = createLocalVue()
localVue.use(Vuex)

const mutations = {
  clearTimeline: () => {},
  setError: () => {}
}

const externalProfileStore = new Vuex.Store({
  mutations,
  state: {
    api: {
      backendInteractor: backendInteractorService('')
    },
    interface: {
      browserSupport: ''
    },
    config: {
      colors: '',
      highlight: {},
      customTheme: {
        colors: []
      }
    },
    instance: {
      hideUserStats: true
    },
    statuses: {
      timelines: {
        user: {
          statuses: [],
          statusesObject: {},
          faves: [],
          visibleStatuses: [],
          visibleStatusesObject: {},
          newStatusCount: 0,
          maxId: 0,
          minVisibleId: 0,
          loading: false,
          followers: [],
          friends: [],
          viewing: 'statuses',
          userId: 701,
          flushMarker: 0
        }
      }
    },
    users: {
      currentUser: {
        credentials: ''
      },
      usersObject: [
        {
          background_image: null,
          cover_photo: 'https://playvicious.social/system/accounts/headers/000/000/001/original/7dae4fc0e8330e83.jpg?1507329206',
          created_at: 'Mon Dec 18 16:01:35 +0000 2017',
          default_scope: 'public',
          description: "Your favorite person's favorite person.",
          description_html: "<p>Your favorite person's favorite person.</p>",
          favourites_count: 0,
          fields: [
            {
              name: '✌🏾',
              value: '<a href="https://thetwelfth.house" rel="me nofollow noopener" target="_blank"><span class="invisible">https://</span><span class="">thetwelfth.house</span><span class="invisible"></span></a>'
            },
            {
              name: '🚧',
              value: '<a href="https://code.playvicio.us" rel="me nofollow noopener" target="_blank"><span class="invisible">https://</span><span class="">code.playvicio.us</span><span class="invisible"></span></a>'
            },
            {
              name: '❤️',
              value: '<a href="https://www.patreon.com/Are0h" rel="me nofollow noopener" target="_blank"><span class="invisible">https://www.</span><span class="">patreon.com/Are0h</span><span class="invisible"></span></a>'
            }
          ],
          followers_count: 2,
          following: false,
          follows_you: false,
          friends_count: 0,
          id: 701,
          is_local: false,
          locked: false,
          name: 'Are0h',
          name_html: 'Are0h',
          no_rich_text: false,
          profile_image_url: 'https://playvicious.social/system/accounts/avatars/000/000/001/original/33e9983bc2d96aeb.png?1520872572',
          profile_image_url_https: 'https://playvicious.social/system/accounts/avatars/000/000/001/original/33e9983bc2d96aeb.png?1520872572',
          profile_image_url_original: 'https://playvicious.social/system/accounts/avatars/000/000/001/original/33e9983bc2d96aeb.png?1520872572',
          profile_image_url_profile_size: 'https://playvicious.social/system/accounts/avatars/000/000/001/original/33e9983bc2d96aeb.png?1520872572',
          rights: {
            delete_others_notice: false
          },
          screen_name: 'Are0h@playvicious.social',
          statuses_count: 6727,
          statusnet_blocking: false,
          statusnet_profile_url: 'https://playvicious.social/users/Are0h'
        }
      ]
    }
  }
})

const localProfileStore = new Vuex.Store({
  mutations,
  state: {
    api: {
      backendInteractor: backendInteractorService('')
    },
    interface: {
      browserSupport: ''
    },
    config: {
      colors: '',
      highlight: {},
      customTheme: {
        colors: []
      }
    },
    instance: {
      hideUserStats: true
    },
    statuses: {
      timelines: {
        user: {
          statuses: [],
          statusesObject: {},
          faves: [],
          visibleStatuses: [],
          visibleStatusesObject: {},
          newStatusCount: 0,
          maxId: 0,
          minVisibleId: 0,
          loading: false,
          followers: [],
          friends: [],
          viewing: 'statuses',
          userId: 701,
          flushMarker: 0
        }
      }
    },
    users: {
      currentUser: {
        credentials: ''
      },
      usersObject: [
        {
          background_image: null,
          cover_photo: 'https://playvicious.social/system/accounts/headers/000/000/001/original/7dae4fc0e8330e83.jpg?1507329206',
          created_at: 'Mon Dec 18 16:01:35 +0000 2017',
          default_scope: 'public',
          description: "Your favorite person's favorite person.",
          description_html: "<p>Your favorite person's favorite person.</p>",
          favourites_count: 0,
          fields: [
            {
              name: '✌🏾',
              value: '<a href="https://thetwelfth.house" rel="me nofollow noopener" target="_blank"><span class="invisible">https://</span><span class="">thetwelfth.house</span><span class="invisible"></span></a>'
            },
            {
              name: '🚧',
              value: '<a href="https://code.playvicio.us" rel="me nofollow noopener" target="_blank"><span class="invisible">https://</span><span class="">code.playvicio.us</span><span class="invisible"></span></a>'
            },
            {
              name: '❤️',
              value: '<a href="https://www.patreon.com/Are0h" rel="me nofollow noopener" target="_blank"><span class="invisible">https://www.</span><span class="">patreon.com/Are0h</span><span class="invisible"></span></a>'
            }
          ],
          followers_count: 2,
          following: false,
          follows_you: false,
          friends_count: 0,
          id: 701,
          is_local: false,
          locked: false,
          name: 'Are0h',
          name_html: 'Are0h',
          no_rich_text: false,
          profile_image_url: 'https://playvicious.social/system/accounts/avatars/000/000/001/original/33e9983bc2d96aeb.png?1520872572',
          profile_image_url_https: 'https://playvicious.social/system/accounts/avatars/000/000/001/original/33e9983bc2d96aeb.png?1520872572',
          profile_image_url_original: 'https://playvicious.social/system/accounts/avatars/000/000/001/original/33e9983bc2d96aeb.png?1520872572',
          profile_image_url_profile_size: 'https://playvicious.social/system/accounts/avatars/000/000/001/original/33e9983bc2d96aeb.png?1520872572',
          rights: {
            delete_others_notice: false
          },
          screen_name: 'Are0h',
          statuses_count: 6727,
          statusnet_blocking: false,
          statusnet_profile_url: 'https://playvicious.social/users/Are0h'
        }
      ]
    }
  }
})

describe('UserProfile', () => {
  it('renders external profile', () => {
    const wrapper = mount(UserProfile, {
      localVue,
      store: externalProfileStore,
      mocks: {
        $route: {
          params: { id: 701 },
          name: 'external-user-profile'
        },
        $t: (msg) => msg
      }
    })

    expect(wrapper.find('.user-screen-name').text()).to.eql('@Are0h@playvicious.social')
  })

  it('renders local profile', () => {
    const wrapper = mount(UserProfile, {
      localVue,
      store: localProfileStore,
      mocks: {
        $route: {
          params: { name: 'Are0h' },
          name: 'user-profile'
        },
        $t: (msg) => msg
      }
    })

    expect(wrapper.find('.user-screen-name').text()).to.eql('@Are0h')
  })
})
