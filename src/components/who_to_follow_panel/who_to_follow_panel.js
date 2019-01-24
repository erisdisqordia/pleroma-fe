import apiService from '../../services/api/api.service.js'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import { shuffle } from 'lodash'

function showWhoToFollow (panel, reply) {
  const shuffled = shuffle(reply)

  panel.usersToFollow.forEach((toFollow, index) => {
    let user = shuffled[index]
    let img = user.avatar || '/images/avi.png'
    let name = user.acct

    toFollow.img = img
    toFollow.name = name

    panel.$store.state.api.backendInteractor.externalProfile(name)
      .then((externalUser) => {
        if (!externalUser.error) {
          panel.$store.commit('addNewUsers', [externalUser])
          toFollow.id = externalUser.id
        }
      })
  })
}

function getWhoToFollow (panel) {
  var credentials = panel.$store.state.users.currentUser.credentials
  if (credentials) {
    panel.usersToFollow.forEach(toFollow => {
      toFollow.name = 'Loading...'
    })
    apiService.suggestions({credentials: credentials})
      .then((reply) => {
        showWhoToFollow(panel, reply)
      })
  }
}

const WhoToFollowPanel = {
  data: () => ({
    usersToFollow: new Array(3).fill().map(x => (
      {
        img: '/images/avi.png',
        name: '',
        id: 0
      }
    ))
  }),
  computed: {
    user: function () {
      return this.$store.state.users.currentUser.screen_name
    },
    suggestionsEnabled () {
      return this.$store.state.instance.suggestionsEnabled
    }
  },
  methods: {
    userProfileLink (id, name) {
      return generateProfileLink(id, name, this.$store.state.instance.restrictedNicknames)
    }
  },
  watch: {
    user: function (user, oldUser) {
      if (this.suggestionsEnabled) {
        getWhoToFollow(this)
      }
    }
  },
  mounted:
    function () {
      if (this.suggestionsEnabled) {
        getWhoToFollow(this)
      }
    }
}

export default WhoToFollowPanel
