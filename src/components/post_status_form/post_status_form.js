import statusPoster from '../../services/status_poster/status_poster.service.js'
import MediaUpload from '../media_upload/media_upload.vue'
import fileTypeService from '../../services/file_type/file_type.service.js'
import Tribute from '../../../node_modules/tributejs/src/Tribute.js'
require('../../../node_modules/tributejs/scss/tribute.scss')

import { merge, reject, map, uniqBy } from 'lodash'

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

const defaultCollection = {
  // symbol that starts the lookup
  trigger: '@',

  // element to target for @mentions
  iframe: null,

  // class added in the flyout menu for active item
  selectClass: 'highlight',

  // function called on select that returns the content to insert
  selectTemplate: function (item) {
    return '@' + item.original.screen_name
  },

  // template for displaying item in menu
  menuItemTemplate: function (item) {
    return `<img src="${item.original.profile_image_url}"></img> <div class='name'>${item.string}</div>`
  },

  // template for when no match is found (optional),
  // If no template is provided, menu is hidden.
  noMatchTemplate: null,

  // specify an alternative parent container for the menu
  menuContainer: document.body,

  // column to search against in the object (accepts function or string)
  lookup: ({name, screen_name}) => `${name} (@${screen_name})`,

  // column that contains the content to insert by default
  fillAttr: 'screen_name',

  // REQUIRED: array of objects to match
  values: [],

  // specify whether a space is required before the trigger character
  requireLeadingSpace: true,

  // specify whether a space is allowed in the middle of mentions
  allowSpaces: false
}

const tribute = new Tribute({ collection: [] })

const PostStatusForm = {
  props: [
    'replyTo',
    'repliedUser',
    'attentions'
  ],
  components: {
    MediaUpload
  },
  data () {
    let statusText = ''

    if (this.replyTo) {
      const currentUser = this.$store.state.users.currentUser
      statusText = buildMentionsString({ user: this.repliedUser, attentions: this.attentions }, currentUser)
    }

    return {
      dropFiles: [],
      submitDisabled: false,
      newStatus: {
        status: statusText,
        files: []
      }
    }
  },
  computed: {
    users () {
      return this.$store.state.users.users
    },
    completions () {
      let users = this.users
      users = merge({values: users}, defaultCollection)
      return [users]
    }
  },
  watch: {
    completions () {
      tribute.collection = this.completions
    }
  },
  mounted () {
    const textarea = this.$el.querySelector('textarea')
    tribute.collection = this.completions
    tribute.attach(textarea)
  },
  methods: {
    postStatus (newStatus) {
      statusPoster.postStatus({
        status: newStatus.status,
        media: newStatus.files,
        store: this.$store,
        inReplyToStatusId: this.replyTo
      })
      this.newStatus = {
        status: '',
        files: []
      }
      this.$emit('posted')
    },
    addMediaFile (fileInfo) {
      this.newStatus.files.push(fileInfo)
      this.enableSubmit()
    },
    removeMediaFile (fileInfo) {
      let index = this.newStatus.files.indexOf(fileInfo)
      this.newStatus.files.splice(index, 1)
    },
    disableSubmit () {
      this.submitDisabled = true
    },
    enableSubmit () {
      this.submitDisabled = false
    },
    type (fileInfo) {
      return fileTypeService.fileType(fileInfo.mimetype)
    },
    fileDrop (e) {
      if (e.dataTransfer.files.length > 0) {
        e.preventDefault()  // allow dropping text like before
        this.dropFiles = e.dataTransfer.files
      }
    },
    fileDrag (e) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }
}

export default PostStatusForm
