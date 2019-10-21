const Modal = {
  props: {
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
