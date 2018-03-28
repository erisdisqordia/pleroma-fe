function showWhoToFollow (panel, users, aHost, aUser) {
  var cn
  var index = 0
  var random = Math.floor(Math.random() * 10)
  for (cn = random; cn < users.length; cn = cn + 10) {
    var user
    user = users[cn]
    var host
    host = user.host
    var username
    if (user.username) {
      username = user.username
    } else {
      username = user.user
    }
    var img
    if (user.avatar) {
      img = user.avatar
    } else {
      img = '/images/avi.png'
    }
    var link = 'https://' + host + '/users/' + username
    var name = username + '@' + host
    if ((!user.following) &&
      (!user.blacklisted) &&
      (!(host === aHost && username === aUser))) {
      if (index === 0) {
        panel.img1 = img
        panel.link1 = link
        panel.name1 = name
      } else if (index === 1) {
        panel.img2 = img
        panel.link2 = link
        panel.name2 = name
      } else if (index === 2) {
        panel.img3 = img
        panel.link3 = link
        panel.name3 = name
      }
      index = index + 1
      if (index > 2) {
        break
      }
    }
  }
}

function getWhoToFollow (panel) {
  var user = panel.$store.state.users.currentUser.screen_name
  if (user) {
    panel.name1 = 'Loading...'
    panel.name2 = 'Loading...'
    panel.name3 = 'Loading...'
    var host = window.location.hostname
    var url = 'https://vinayaka.distsn.org/cgi-bin/vinayaka-user-match-simple-api.cgi?' +
      encodeURIComponent(host) + '+' + encodeURIComponent(user)
    window.fetch(url, {mode: 'cors'}).then(function (response) {
      if (response.ok) {
        return response.json()
      } else {
        panel.name1 = ''
        panel.name2 = ''
        panel.name3 = ''
      }
    }).then(function (users) {
      showWhoToFollow(panel, users, host, user)
    })
  }
}

const WhoToFollowPanel = {
  data: () => ({
    img1: '/images/avi.png',
    link1: null,
    name1: '',
    img2: '/images/avi.png',
    link2: null,
    name2: '',
    img3: '/images/avi.png',
    link3: null,
    name3: ''
  }),
  computed: {
    user: function () {
      return this.$store.state.users.currentUser.screen_name
    },
    moreUrl: function () {
      var host = window.location.hostname
      var user = this.user
      var url = 'https://vinayaka.distsn.org/?' +
            encodeURIComponent(host) + '+' + encodeURIComponent(user)
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
