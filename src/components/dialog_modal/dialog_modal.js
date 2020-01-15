const DialogModal = {
  props: {
    darkOverlay: {
      default: true,
      type: Boolean
    },
    onCancel: {
      default: () => {},
      type: Function
    }
  }
}

export default DialogModal
