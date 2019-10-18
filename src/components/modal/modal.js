const Modal = {
  props: {
    viewClass: {
      type: String
    },
    isOpen: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}

export default Modal
