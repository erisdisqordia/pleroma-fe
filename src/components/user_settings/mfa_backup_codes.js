export default {
  props: {
    backupCodes: {
      type: Object,
      default: () => ({
        inProgress: false,
        codes: []
      })
    }
  },
  data: () => ({}),
  computed: {
    inProgress () { return this.backupCodes.inProgress },
    ready () { return this.backupCodes.codes.length > 0 },
    displayTitle () { return this.inProgress || this.ready }
  }
}
