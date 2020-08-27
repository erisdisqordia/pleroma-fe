import Importer from 'src/components/importer/importer.vue'
import Exporter from 'src/components/exporter/exporter.vue'
import Checkbox from 'src/components/checkbox/checkbox.vue'

const DataImportExportTab = {
  data () {
    return {
      activeTab: 'profile',
      newDomainToMute: ''
    }
  },
  created () {
    this.$store.dispatch('fetchTokens')
  },
  components: {
    Importer,
    Exporter,
    Checkbox
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    }
  },
  methods: {
    getFollowsContent () {
      return this.$store.state.api.backendInteractor.exportFriends({ id: this.$store.state.users.currentUser.id })
        .then(this.generateExportableUsersContent)
    },
    getBlocksContent () {
      return this.$store.state.api.backendInteractor.fetchBlocks()
        .then(this.generateExportableUsersContent)
    },
    importFollows (file) {
      return this.$store.state.api.backendInteractor.importFollows({ file })
        .then((status) => {
          if (!status) {
            throw new Error('failed')
          }
        })
    },
    importBlocks (file) {
      return this.$store.state.api.backendInteractor.importBlocks({ file })
        .then((status) => {
          if (!status) {
            throw new Error('failed')
          }
        })
    },
    generateExportableUsersContent (users) {
      // Get addresses
      return users.map((user) => {
        // check is it's a local user
        if (user && user.is_local) {
          // append the instance address
          // eslint-disable-next-line no-undef
          return user.screen_name + '@' + location.hostname
        }
        return user.screen_name
      }).join('\n')
    }
  }
}

export default DataImportExportTab
