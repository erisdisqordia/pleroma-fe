import Attachment from '../attachment/attachment.vue'
import { chunk, last, dropRight } from 'lodash'

const Gallery = {
  props: [
    'attachments',
    'nsfw',
    'setMedia'
  ],
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
    rowStyle () {
      return itemsPerRow => ({ 'padding-bottom': `${(100 / (itemsPerRow + 0.6))}%` })
    },
    useContainFit () {
      return this.$store.state.config.useContainFit
    }
  }
}

export default Gallery
