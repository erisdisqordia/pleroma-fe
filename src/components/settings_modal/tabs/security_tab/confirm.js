const Confirm = {
  props: ['disabled'],
  data: () => ({}),
  methods: {
    confirm () { this.$emit('confirm') },
    cancel () { this.$emit('cancel') }
  }
}
export default Confirm
