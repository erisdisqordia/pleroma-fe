import StillImage from '../still-image/still-image.vue'

const UserAvatar = {
  props: [
    'user',
    'betterShadow',
    'compact'
  ],
  data () {
    return {
      showPlaceholder: false,
      defaultAvatar: `${this.$store.state.instance.server + this.$store.state.instance.defaultAvatar}`
    }
  },
  components: {
    StillImage
  },
  methods: {
    imgSrc (src) {
      return (!src || this.showPlaceholder) ? this.defaultAvatar : src
    },
    imageLoadError () {
      this.showPlaceholder = true
    }
  }
}

export default UserAvatar
