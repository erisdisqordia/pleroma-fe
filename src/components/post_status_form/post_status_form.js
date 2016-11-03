import statusPoster from '../../services/status_poster/status_poster.service.js'
import { reject, map, uniqBy } from 'lodash';

const buildMentionsString = ({user, attentions}, currentUser) => {

  let allAttentions = [...attentions]

  allAttentions.unshift(user)

  allAttentions = uniqBy(allAttentions, 'id')
  allAttentions = reject(allAttentions, {id: currentUser.id})

  let mentions = map(allAttentions, (attention) => {
    return `@${attention.screen_name}`
  })

  return mentions.join(' ') + ' '
}

const PostStatusForm = {
  props: [
    'replyTo',
    'repliedUser',
    'attentions'
  ],
  data () {
    let statusText = ''

    if (this.replyTo) {
      const currentUser = this.$store.state.users.currentUser
      statusText = buildMentionsString({ user: this.repliedUser, attentions: this.attentions }, currentUser)
    }

    return {
      newStatus: {
        status: statusText
      }
    }
  },
  methods: {
    postStatus (newStatus) {
      statusPoster.postStatus({
        status: newStatus.status,
        store: this.$store,
        inReplyToStatusId: this.replyTo
      })
      this.newStatus = { }
      this.$emit('posted')
    }
  }
}

export default PostStatusForm
