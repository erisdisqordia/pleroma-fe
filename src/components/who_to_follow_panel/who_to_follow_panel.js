function showWhoToFollow (panel, reply, aHost, aUser) {
  var users = reply.ids
  var cn
  var index = 0
  var random = Math.floor(Math.random() * 10)
  for (cn = random; cn < users.length; cn = cn + 10) {
    var user
    user = users[cn]
    var img
    if (user.avatar) {
      img = user.icon
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
    index = index + 1
    if (index > 2) {
      break
    }
  }
}

function getWhoToFollow (panel) {
  var credentials = panel.$store.state.users.currentUser.credentials
  if (credentials) {
    panel.name1 = 'Loading...'
    panel.name2 = 'Loading...'
    panel.name3 = 'Loading...'
    var url = '/api/v1/suggestions'
    window.fetch(url, {headers: authHeaders(credentials)}).then(function (response) {
      if (response.ok) {
        return response.json()
      } else {
        panel.name1 = ''
        panel.name2 = ''
        panel.name3 = ''
      }
    }).then(function (reply) {
      showWhoToFollow(panel, reply, host, user)
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
      var whoToFollowLink = this.$store.state.config.whoToFollowLink
      var url
      url = whoToFollowLink.replace(/{{host}}/g, encodeURIComponent(host))
      url = url.replace(/{{user}}/g, encodeURIComponent(user))
      return url
    },
    showWhoToFollowPanel () {
      return this.$store.state.config.showWhoToFollowPanel
    }
  },
  watch: {
    user: function (user, oldUser) {
      if (this.showWhoToFollowPanel) {
        getWhoToFollow(this)
      }
    }
  },
  mounted:
    function () {
      if (this.showWhoToFollowPanel) {
        getWhoToFollow(this)
      }
    }
}

export default WhoToFollowPanel
