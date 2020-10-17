import Importer from 'src/components/importer/importer.vue'
import Exporter from 'src/components/exporter/exporter.vue'
import Checkbox from 'src/components/checkbox/checkbox.vue'
import { mapState } from 'vuex'

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
    ...mapState({
      backendInteractor: (state) => state.api.backendInteractor,
      user: (state) => state.users.currentUser
    })
  },
  methods: {
    getFollowsContent () {
      return this.backendInteractor.exportFriends({ id: this.user.id })
        .then(this.generateExportableUsersContent)
    },
    getBlocksContent () {
      return this.backendInteractor.fetchBlocks()
        .then(this.generateExportableUsersContent)
    },
    getMutesContent () {
      return this.backendInteractor.fetchMutes()
        .then(this.generateExportableUsersContent)
    },
    importFollows (file) {
      return this.backendInteractor.importFollows({ file })
        .then((status) => {
          if (!status) {
            throw new Error('failed')
          }
        })
    },
    importBlocks (file) {
      return this.backendInteractor.importBlocks({ file })
        .then((status) => {
          if (!status) {
            throw new Error('failed')
          }
        })
    },
    importMutes (file) {
      return this.backendInteractor.importMutes({ file })
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
