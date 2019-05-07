import PostStatusForm from '../post_status_form/post_status_form.vue'
import { throttle } from 'lodash'

const MobilePostStatusModal = {
  components: {
    PostStatusForm
  },
  data () {
    return {
      hidden: false,
      postFormOpen: false,
      scrollingDown: false,
      inputActive: false,
      oldScrollPos: 0,
      amountScrolled: 0
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleOSK)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleOSK)
  },
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    },
    isHidden () {
      return this.hidden || this.inputActive
    }
  },
  methods: {
    openPostForm () {
      this.postFormOpen = true
      this.hidden = true

      const el = this.$el.querySelector('textarea')
      this.$nextTick(function () {
        el.focus()
      })
    },
    closePostForm () {
      this.postFormOpen = false
      this.hidden = false
    },
    handleOSK () {
      // This is a big hack: we're guessing from changed window sizes if the
      // on-screen keyboard is active or not. This is only really important
      // for phones in portrait mode and it's more important to show the button
      // in normal scenarios on all phones, than it is to hide it when the
      // keyboard is active.
      // Guesswork based on https://www.mydevice.io/#compare-devices

      // for example, iphone 4 and android phones from the same time period
      const smallPhone = window.innerWidth < 350
      const smallPhoneKbOpen = smallPhone && window.innerHeight < 345

      const biggerPhone = !smallPhone && window.innerWidth < 450
      const biggerPhoneKbOpen = biggerPhone && window.innerHeight < 560
      if (smallPhoneKbOpen || biggerPhoneKbOpen) {
        this.inputActive = true
      } else {
        this.inputActive = false
      }
    },
    handleScroll: throttle(function () {
      const scrollAmount = window.scrollY - this.oldScrollPos
      const scrollingDown = scrollAmount > 0

      if (scrollingDown !== this.scrollingDown) {
        this.amountScrolled = 0
        this.scrollingDown = scrollingDown
        if (!scrollingDown) {
          this.hidden = false
        }
      } else if (scrollingDown) {
        this.amountScrolled += scrollAmount
        if (this.amountScrolled > 100 && !this.hidden) {
          this.hidden = true
        }
      }

      this.oldScrollPos = window.scrollY
      this.scrollingDown = scrollingDown
    }, 100)
  }
}

export default MobilePostStatusModal
