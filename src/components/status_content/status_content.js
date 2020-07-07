import Attachment from '../attachment/attachment.vue'
import Poll from '../poll/poll.vue'
import Gallery from '../gallery/gallery.vue'
import LinkPreview from '../link-preview/link-preview.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import fileType from 'src/services/file_type/file_type.service'
import { processHtml } from 'src/services/tiny_post_html_processor/tiny_post_html_processor.service.js'
import { mentionMatchesUrl, extractTagFromUrl } from 'src/services/matcher/matcher.service.js'
import { mapGetters, mapState } from 'vuex'

const StatusContent = {
  name: 'StatusContent',
  props: [
    'status',
    'focused',
    'noHeading',
    'fullContent'
  ],
  data () {
    return {
      showingTall: this.inConversation && this.focused,
      showingLongSubject: false,
      // not as computed because it sets the initial state which will be changed later
      expandingSubject: !this.$store.getters.mergedConfig.collapseMessageWithSubject
    }
  },
  computed: {
    localCollapseSubjectDefault () {
      return this.mergedConfig.collapseMessageWithSubject
    },
    hideAttachments () {
      return (this.mergedConfig.hideAttachments && !this.inConversation) ||
        (this.mergedConfig.hideAttachmentsInConv && this.inConversation)
    },
    // This is a bit hacky, but we want to approximate post height before rendering
    // so we count newlines (masto uses <p> for paragraphs, GS uses <br> between them)
    // as well as approximate line count by counting characters and approximating ~80
    // per line.
    //
    // Using max-height + overflow: auto for status components resulted in false positives
    // very often with japanese characters, and it was very annoying.
    tallStatus () {
      const lengthScore = this.status.statusnet_html.split(/<p|<br/).length + this.status.text.length / 80
      return lengthScore > 20
    },
    longSubject () {
      return this.status.summary.length > 240
    },
    // When a status has a subject and is also tall, we should only have one show more/less button. If the default is to collapse statuses with subjects, we just treat it like a status with a subject; otherwise, we just treat it like a tall status.
    mightHideBecauseSubject () {
      return !!this.status.summary && this.localCollapseSubjectDefault
    },
    mightHideBecauseTall () {
      return this.tallStatus && !(this.status.summary && this.localCollapseSubjectDefault)
    },
    hideSubjectStatus () {
      return this.mightHideBecauseSubject && !this.expandingSubject
    },
    hideTallStatus () {
      return this.mightHideBecauseTall && !this.showingTall
    },
    showingMore () {
      return (this.mightHideBecauseTall && this.showingTall) || (this.mightHideBecauseSubject && this.expandingSubject)
    },
    nsfwClickthrough () {
      if (!this.status.nsfw) {
        return false
      }
      if (this.status.summary && this.localCollapseSubjectDefault) {
        return false
      }
      return true
    },
    attachmentSize () {
      if ((this.mergedConfig.hideAttachments && !this.inConversation) ||
        (this.mergedConfig.hideAttachmentsInConv && this.inConversation) ||
        (this.status.attachments.length > this.maxThumbnails)) {
        return 'hide'
      } else if (this.compact) {
        return 'small'
      }
      return 'normal'
    },
    galleryTypes () {
      if (this.attachmentSize === 'hide') {
        return []
      }
      return this.mergedConfig.playVideosInModal
        ? ['image', 'video']
        : ['image']
    },
    galleryAttachments () {
      return this.status.attachments.filter(
        file => fileType.fileMatchesSomeType(this.galleryTypes, file)
      )
    },
    nonGalleryAttachments () {
      return this.status.attachments.filter(
        file => !fileType.fileMatchesSomeType(this.galleryTypes, file)
      )
    },
    attachmentTypes () {
      return this.status.attachments.map(file => fileType.fileType(file.mimetype))
    },
    maxThumbnails () {
      return this.mergedConfig.maxThumbnails
    },
    postBodyHtml () {
      const html = this.status.statusnet_html

      if (this.mergedConfig.greentext) {
        try {
          if (html.includes('&gt;')) {
            // This checks if post has '>' at the beginning, excluding mentions so that @mention >impying works
            return processHtml(html, (string) => {
              if (string.includes('&gt;') &&
                  string
                    .replace(/<[^>]+?>/gi, '') // remove all tags
                    .replace(/@\w+/gi, '') // remove mentions (even failed ones)
                    .trim()
                    .startsWith('&gt;')) {
                return `<span class='greentext'>${string}</span>`
              } else {
                return string
              }
            })
          } else {
            return html
          }
        } catch (e) {
          console.err('Failed to process status html', e)
          return html
        }
      } else {
        return html
      }
    },
    ...mapGetters(['mergedConfig']),
    ...mapState({
      betterShadow: state => state.interface.browserSupport.cssFilter,
      currentUser: state => state.users.currentUser
    })
  },
  components: {
    Attachment,
    Poll,
    Gallery,
    LinkPreview
  },
  methods: {
    linkClicked (event) {
      const target = event.target.closest('.status-content a')
      if (target) {
        if (target.className.match(/mention/)) {
          const href = target.href
          const attn = this.status.attentions.find(attn => mentionMatchesUrl(attn, href))
          if (attn) {
            event.stopPropagation()
            event.preventDefault()
            const link = this.generateUserProfileLink(attn.id, attn.screen_name)
            this.$router.push(link)
            return
          }
        }
        if (target.rel.match(/(?:^|\s)tag(?:$|\s)/) || target.className.match(/hashtag/)) {
          // Extract tag name from dataset or link url
          const tag = target.dataset.tag || extractTagFromUrl(target.href)
          if (tag) {
            const link = this.generateTagLink(tag)
            this.$router.push(link)
            return
          }
        }
        window.open(target.href, '_blank')
      }
    },
    toggleShowMore () {
      if (this.mightHideBecauseTall) {
        this.showingTall = !this.showingTall
      } else if (this.mightHideBecauseSubject) {
        this.expandingSubject = !this.expandingSubject
      }
    },
    generateUserProfileLink (id, name) {
      return generateProfileLink(id, name, this.$store.state.instance.restrictedNicknames)
    },
    generateTagLink (tag) {
      return `/tag/${tag}`
    },
    setMedia () {
      const attachments = this.attachmentSize === 'hide' ? this.status.attachments : this.galleryAttachments
      return () => this.$store.dispatch('setMedia', attachments)
    }
  }
}

export default StatusContent
