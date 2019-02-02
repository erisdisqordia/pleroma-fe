import StillImage from '../still-image/still-image.vue'
import avatarPlaceholderImage from '../../assets/avatar-placeholder.png'

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
      return this.showPlaceholder ? avatarPlaceholderImage : this.src
    }
  },
  methods: {
    imageLoadError () {
      this.showPlaceholder = true
    }
  }
}

export default UserAvatar
