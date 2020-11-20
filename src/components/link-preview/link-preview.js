import { mapGetters } from 'vuex'

const LinkPreview = {
  name: 'LinkPreview',
  props: [
    'card',
    'size',
    'nsfw'
  ],
  data () {
    return {
      imageLoaded: false
    }
  },
  computed: {
    useImage () {
      // Currently BE shoudn't give cards if tagged NSFW, this is a bit paranoid
      // as it makes sure to hide the image if somehow NSFW tagged preview can
      // exist.
      return this.card.image && !this.censored && this.size !== 'hide'
    },
    censored () {
      return this.nsfw && this.hideNsfwConfig
    },
    useDescription () {
      return this.card.description && /\S/.test(this.card.description)
    },
    hideNsfwConfig () {
      return this.mergedConfig.hideNsfw
    },
    ...mapGetters([
      'mergedConfig'
    ])
  },
  created () {
    if (this.useImage) {
      const newImg = new Image()
      newImg.onload = () => {
        this.imageLoaded = true
      }
      newImg.src = this.card.image
    }
  }
}

export default LinkPreview
