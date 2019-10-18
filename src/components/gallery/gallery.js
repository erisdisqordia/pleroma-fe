import Attachment from '../attachment/attachment.vue'
import { chunk, last, dropRight } from 'lodash'

const Gallery = {
  props: [
    'attachments',
    'nsfw',
    'setMedia'
  ],
  data () {
    return {
      sizes: {}
    }
  },
  components: { Attachment },
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
    useContainFit () {
      return this.$store.state.config.useContainFit
    }
  },
  methods: {
    onNaturalSizeLoad (id, size) {
      this.$set(this.sizes, id, size)
    },
    rowStyle (itemsPerRow) {
      return { 'padding-bottom': `${(100 / (itemsPerRow + 0.6))}%` }
    },
    itemStyle (id) {
      const size = this.sizes[id]
      if (size) {
        return { flex: size.width / size.height }
      } else {
        return {}
      }
    }
  }
}

export default Gallery
