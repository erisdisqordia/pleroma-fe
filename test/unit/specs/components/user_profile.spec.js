import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import UserProfile from 'src/components/user_profile/user_profile.vue'
import backendInteractorService from 'src/services/backend_interactor_service/backend_interactor_service.js'
import { getters } from 'src/modules/users.js'

const localVue = createLocalVue()
localVue.use(Vuex)

const mutations = {
  clearTimeline: () => {},
  setError: () => {}
}

const testGetters = {
  userByName: state => getters.userByName(state.users),
  userById: state => getters.userById(state.users)
}

const localUser = {
  id: 100,
  is_local: true,
  screen_name: 'testUser'
}

const extUser = {
  id: 100,
  is_local: false,
  screen_name: 'testUser@test.instance'
}

const externalProfileStore = new Vuex.Store({
  mutations,
  getters: testGetters,
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
          userId: 100,
          flushMarker: 0
        },
        media: {
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
          userId: 100,
          flushMarker: 0
        }
      }
    },
    users: {
      currentUser: {
        credentials: ''
      },
      usersObject: [extUser],
      users: [extUser]
    }
  }
})

const localProfileStore = new Vuex.Store({
  mutations,
  getters: testGetters,
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
          userId: 100,
          flushMarker: 0
        },
        media: {
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
          userId: 100,
          flushMarker: 0
        }
      }
    },
    users: {
      currentUser: {
        credentials: ''
      },
      usersObject: [localUser],
      users: [localUser]
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
          params: { id: 100 },
          name: 'external-user-profile'
        },
        $t: (msg) => msg
      }
    })

    expect(wrapper.find('.user-screen-name').text()).to.eql('@testUser@test.instance')
  })

  it('renders local profile', () => {
    const wrapper = mount(UserProfile, {
      localVue,
      store: localProfileStore,
      mocks: {
        $route: {
          params: { name: 'testUser' },
          name: 'user-profile'
        },
        $t: (msg) => msg
      }
    })

    expect(wrapper.find('.user-screen-name').text()).to.eql('@testUser')
  })
})
