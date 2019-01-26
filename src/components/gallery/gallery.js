import Attachment from '../attachment/attachment.vue'
import { chunk, last, dropRight } from 'lodash'

const Gallery = {
  data: () => ({
    width: 500
  }),
  props: [
    'attachments',
    'nsfw',
    'setMedia'
  ],
  components: { Attachment },
  mounted () {
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  destroyed () {
    window.removeEventListener('resize', this.resize)
  },
  computed: {
    rows () {
      if (!this.attachments) {
        return []
      }
      const rows = chunk(this.attachments, 3)
      if (last(rows).length === 1 && rows.length > 1) {
        // if 1 attachment on last row -> add it to the previous row instead
        const lastAttachment = last(rows)[0]
        const allButLastRow = dropRight(rows)
        last(allButLastRow).push(lastAttachment)
        return allButLastRow
      }
      return rows
    },
    rowHeight () {
      return itemsPerRow => ({ 'height': `${(this.width / (itemsPerRow + 0.6))}px` })
    },
    useContainFit () {
      return this.$store.state.config.useContainFit
    }
  },
  methods: {
    resize () {
      // Quick optimization to make resizing not always trigger state change,
      // only update attachment size in 10px steps
      const width = Math.floor(this.$el.getBoundingClientRect().width / 10) * 10
      if (this.width !== width) {
        this.width = width
      }
    }
  }
}

export default Gallery
