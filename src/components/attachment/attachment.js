import StillImage from '../still-image/still-image.vue'
import VideoAttachment from '../video_attachment/video_attachment.vue'
import nsfwImage from '../../assets/nsfw.png'
import fileTypeService from '../../services/file_type/file_type.service.js'
import { mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faFile,
  faMusic,
  faImage,
  faVideo
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faFile,
  faMusic,
  faImage,
  faVideo
)

const Attachment = {
  props: [
    'attachment',
    'nsfw',
    'size',
    'allowPlay',
    'setMedia',
    'naturalSizeLoad'
  ],
  data () {
    return {
      nsfwImage: this.$store.state.instance.nsfwCensorImage || nsfwImage,
      hideNsfwLocal: this.$store.getters.mergedConfig.hideNsfw,
      preloadImage: this.$store.getters.mergedConfig.preloadImage,
      loading: false,
      img: fileTypeService.fileType(this.attachment.mimetype) === 'image' && document.createElement('img'),
      modalOpen: false,
      showHidden: false
    }
  },
  components: {
    StillImage,
    VideoAttachment
  },
  computed: {
    usePlaceholder () {
      return this.size === 'hide' || this.type === 'unknown'
    },
    placeholderName () {
      if (this.attachment.description === '' || !this.attachment.description) {
        return this.type.toUpperCase()
      }
      return this.attachment.description
    },
    placeholderIconClass () {
      if (this.type === 'image') return 'image'
      if (this.type === 'video') return 'video'
      if (this.type === 'audio') return 'music'
      return 'file'
    },
    referrerpolicy () {
      return this.$store.state.instance.mediaProxyAvailable ? '' : 'no-referrer'
    },
    type () {
      return fileTypeService.fileType(this.attachment.mimetype)
    },
    hidden () {
      return this.nsfw && this.hideNsfwLocal && !this.showHidden
    },
    isEmpty () {
      return (this.type === 'html' && !this.attachment.oembed) || this.type === 'unknown'
    },
    isSmall () {
      return this.size === 'small'
    },
    fullwidth () {
      if (this.size === 'hide') return false
      return this.type === 'html' || this.type === 'audio' || this.type === 'unknown'
    },
    useModal () {
      const modalTypes = this.size === 'hide' ? ['image', 'video', 'audio']
        : this.mergedConfig.playVideosInModal
          ? ['image', 'video']
          : ['image']
      return modalTypes.includes(this.type)
    },
    ...mapGetters(['mergedConfig'])
  },
  methods: {
    linkClicked ({ target }) {
      if (target.tagName === 'A') {
        window.open(target.href, '_blank')
      }
    },
    openModal (event) {
      if (this.useModal) {
        event.stopPropagation()
        event.preventDefault()
        this.setMedia()
        this.$store.dispatch('setCurrent', this.attachment)
      }
    },
    toggleHidden (event) {
      if (
        (this.mergedConfig.useOneClickNsfw && !this.showHidden) &&
        (this.type !== 'video' || this.mergedConfig.playVideosInModal)
      ) {
        this.openModal(event)
        return
      }
      if (this.img && !this.preloadImage) {
        if (this.img.onload) {
          this.img.onload()
        } else {
          this.loading = true
          this.img.src = this.attachment.url
          this.img.onload = () => {
            this.loading = false
            this.showHidden = !this.showHidden
          }
        }
      } else {
        this.showHidden = !this.showHidden
      }
    },
    onImageLoad (image) {
      const width = image.naturalWidth
      const height = image.naturalHeight
      this.naturalSizeLoad && this.naturalSizeLoad({ width, height })
    }
  }
}

export default Attachment
