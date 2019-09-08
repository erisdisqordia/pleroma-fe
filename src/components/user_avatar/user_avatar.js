import StillImage from '../still-image/still-image.vue'

const UserAvatar = {
  props: [
    'user',
    'betterShadow',
    'compact'
  ],
  data () {
    return {
      showPlaceholder: false
    }
  },
  components: {
    StillImage
  },
  computed: {
    imgSrc () {
      return this.showPlaceholder ? '/images/avi.png' : this.user.profile_image_url_original
    }
  },
  methods: {
    imageLoadError () {
      this.showPlaceholder = true
    }
  },
  watch: {
    src () {
      this.showPlaceholder = false
    }
  }
}

export default UserAvatar
