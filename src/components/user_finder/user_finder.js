const UserFinder = {
  data: () => ({
    username: undefined,
    hidden: true,
    error: false,
    loading: false
  }),
  methods: {
    findUser (username) {
      this.$router.push({ name: 'user-search', query: { query: username } })
      this.$refs.username.focus()
    },
    toggleHidden () {
      this.hidden = !this.hidden
      this.$emit('toggled', this.hidden)
    }
  }
}

export default UserFinder
