import PostStatusForm from '../post_status_form/post_status_form.vue'
import { debounce } from 'lodash'

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
    if (this.autohideFloatingPostButton) {
      this.activateFloatingPostButtonAutohide()
    }
    window.addEventListener('resize', this.handleOSK)
  },
  destroyed () {
    if (this.autohideFloatingPostButton) {
      this.deactivateFloatingPostButtonAutohide()
    }
    window.removeEventListener('resize', this.handleOSK)
  },
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    },
    isHidden () {
      return this.autohideFloatingPostButton && (this.hidden || this.inputActive)
    },
    autohideFloatingPostButton () {
      return !!this.$store.state.config.autohideFloatingPostButton
    }
  },
  watch: {
    autohideFloatingPostButton: function (isEnabled) {
      if (isEnabled) {
        this.activateFloatingPostButtonAutohide()
      } else {
        this.deactivateFloatingPostButtonAutohide()
      }
    }
  },
  methods: {
    activateFloatingPostButtonAutohide () {
      window.addEventListener('scroll', this.handleScrollStart)
      window.addEventListener('scroll', this.handleScrollEnd)
    },
    deactivateFloatingPostButtonAutohide () {
      window.removeEventListener('scroll', this.handleScrollStart)
      window.removeEventListener('scroll', this.handleScrollEnd)
    },
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
    handleScrollStart: debounce(function () {
      if (window.scrollY > this.oldScrollPos) {
        this.hidden = true
      } else {
        this.hidden = false
      }
      this.oldScrollPos = window.scrollY
    }, 100, {leading: true, trailing: false}),

    handleScrollEnd: debounce(function () {
      this.hidden = false
      this.oldScrollPos = window.scrollY
    }, 100, {leading: false, trailing: true})
  }
}

export default MobilePostStatusModal
