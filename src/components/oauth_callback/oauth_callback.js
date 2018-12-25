import oauth from '../../services/new_api/oauth.js'

const oac = {
  props: ['code'],
  mounted () {
    if (this.code) {
      oauth.getToken({
        app: this.$store.state.oauth,
        instance: this.$store.state.instance.server,
        code: this.code
      }).then((result) => {
        this.$store.commit('setToken', result.access_token)
        this.$store.dispatch('loginUser', result.access_token)
        this.$router.push({name: 'friends'})
      })
    }
  }
}

export default oac
