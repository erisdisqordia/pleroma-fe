const Modal = {
  props: ['show', 'title'],
  methods: {
    close: function () {
      this.$emit('close')
    },
    handleKeydown: function (e) {
      if (this.show && e.keyCode === 27) {
        this.close()
      }
    }
  },
  mounted: function () {
    document.addEventListener('keydown', this.handleKeydown)
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.handleKeydown)
  }
}

export default Modal
