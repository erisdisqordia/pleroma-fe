import PostStatusForm from '../post_status_form/post_status_form.vue'

const PostStatusModal = {
  components: {
    PostStatusForm
  },
  computed: {
    isLoggedIn () {
      return !!this.$store.state.users.currentUser
    },
    isOpen () {
      return this.isLoggedIn && this.$store.state.postStatus.modalActivated
    },
    params () {
      return this.$store.state.postStatus.params
    }
  },
  watch: {
    isOpen (val) {
      if (val) {
        this.$nextTick(() => this.$el.querySelector('textarea').focus())
      }
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('closePostStatusModal')
    }
  }
}

export default PostStatusModal
