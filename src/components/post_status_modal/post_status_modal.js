import PostStatusForm from '../post_status_form/post_status_form.vue'
import Modal from '../modal/modal.vue'
import get from 'lodash/get'

const PostStatusModal = {
  components: {
    PostStatusForm,
    Modal
  },
  data () {
    return {
      resettingForm: false
    }
  },
  computed: {
    isLoggedIn () {
      return !!this.$store.state.users.currentUser
    },
    modalActivated () {
      return this.$store.state.postStatus.modalActivated
    },
    isFormVisible () {
      return this.isLoggedIn && !this.resettingForm && this.modalActivated
    },
    params () {
      return this.$store.state.postStatus.params || {}
    }
  },
  watch: {
    params (newVal, oldVal) {
      if (get(newVal, 'repliedUser.id') !== get(oldVal, 'repliedUser.id')) {
        this.resettingForm = true
        this.$nextTick(() => {
          this.resettingForm = false
        })
      }
    },
    isFormVisible (val) {
      if (val) {
        this.$nextTick(() => this.$el && this.$el.querySelector('textarea').focus())
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
