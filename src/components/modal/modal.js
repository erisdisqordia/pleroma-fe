const Modal = {
  props: ['show', 'title'],
  methods: {
    close: function () {
      this.$emit('close')
    }
  },
  mounted: function () {
    document.addEventListener('keydown', (e) => {
      if (this.show && e.keyCode === 27) {
        this.close()
      }
    })
  }
}

export default Modal
