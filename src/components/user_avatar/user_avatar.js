import StillImage from '../still-image/still-image.vue'

const UserAvatar = {
  props: [
    'src',
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
      return this.showPlaceholder ? '/images/avi.png' : this.src
    }
  },
  methods: {
    imageLoadError () {
      this.showPlaceholder = true
    }
  }
}

export default UserAvatar
