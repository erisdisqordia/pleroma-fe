import apiService from '../../services/api/api.service.js'

function showWhoToFollow (panel, reply) {
  var users = reply
  var cn
  var index
  var step = 7
  cn = Math.floor(Math.random() * step)
  for (index = 0; index < 3; index++) {
    var user
    user = users[cn]
    var img
    if (user.avatar) {
      img = user.avatar
    } else {
      img = '/images/avi.png'
    }
    var name = user.acct
    if (index === 0) {
      panel.img1 = img
      panel.name1 = name
      panel.$store.state.api.backendInteractor.externalProfile(name)
        .then((externalUser) => {
          if (!externalUser.error) {
            panel.$store.commit('addNewUsers', [externalUser])
            panel.id1 = externalUser.id
          }
        })
    } else if (index === 1) {
      panel.img2 = img
      panel.name2 = name
      panel.$store.state.api.backendInteractor.externalProfile(name)
        .then((externalUser) => {
          if (!externalUser.error) {
            panel.$store.commit('addNewUsers', [externalUser])
            panel.id2 = externalUser.id
          }
        })
    } else if (index === 2) {
      panel.img3 = img
      panel.name3 = name
      panel.$store.state.api.backendInteractor.externalProfile(name)
        .then((externalUser) => {
          if (!externalUser.error) {
            panel.$store.commit('addNewUsers', [externalUser])
            panel.id3 = externalUser.id
          }
        })
    }
    cn = (cn + step) % users.length
  }
}

function getWhoToFollow (panel) {
  var credentials = panel.$store.state.users.currentUser.credentials
  if (credentials) {
    panel.name1 = 'Loading...'
    panel.name2 = 'Loading...'
    panel.name3 = 'Loading...'
    apiService.suggestions({credentials: credentials})
      .then((reply) => {
        showWhoToFollow(panel, reply)
      })
  }
}

const WhoToFollowPanel = {
  data: () => ({
    img1: '/images/avi.png',
    name1: '',
    id1: 0,
    img2: '/images/avi.png',
    name2: '',
    id2: 0,
    img3: '/images/avi.png',
    name3: '',
    id3: 0
  }),
  computed: {
    user: function () {
      return this.$store.state.users.currentUser.screen_name
    },
    moreUrl: function () {
      var host = window.location.hostname
      var user = this.user
      var suggestionsWeb = this.$store.state.instance.suggestionsWeb
      var url
      url = suggestionsWeb.replace(/{{host}}/g, encodeURIComponent(host))
      url = url.replace(/{{user}}/g, encodeURIComponent(user))
      return url
    },
    suggestionsEnabled () {
      return this.$store.state.instance.suggestionsEnabled
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
