import oauth from '../../services/new_api/oauth.js'

const oac = {
  props: ['code'],
  mounted () {
    if (this.code) {
      const { clientId } = this.$store.state.oauth

      oauth.getToken({
        clientId,
        instance: this.$store.state.instance.server,
        code: this.code
      }).then((result) => {
        this.$store.commit('setToken', result.access_token)
        this.$store.dispatch('loginUser', result.access_token)
        this.$router.push({ name: 'friends' })
      })
    }
  }
}

export default oac
