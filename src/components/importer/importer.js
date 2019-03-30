const Importer = {
  data () {
    return {
      file: null,
      error: false,
      success: false,
      uploading: false
    }
  },
  methods: {
    change () {
      this.file = this.$refs.input.files[0]
    },
    submit () {
      this.uploading = true
      this.$store.state.api.backendInteractor.followImport(this.file)
        .then((status) => {
          if (status) {
            this.success = true
          } else {
            this.error = true
          }
          this.uploading = false
        })
    },
    dismiss () {
      this.success = false
      this.error = false
    }
  }
}

export default Importer
