import StillImage from '../still-image/still-image.vue'
import nsfwImage from '../../assets/nsfw.png'

const UserAvatar = {
  props: [
    'src'
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
      return this.showPlaceholder ? nsfwImage : this.src
    }
  },
  methods: {
    imageLoadError () {
      this.showPlaceholder = true
    }
  }
}

export default UserAvatar
