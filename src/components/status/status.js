import Attachment from '../attachment/attachment.vue'
import FavoriteButton from '../favorite_button/favorite_button.vue'
import ReactButton from '../react_button/react_button.vue'
import RetweetButton from '../retweet_button/retweet_button.vue'
import Poll from '../poll/poll.vue'
import ExtraButtons from '../extra_buttons/extra_buttons.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'
import UserCard from '../user_card/user_card.vue'
import UserAvatar from '../user_avatar/user_avatar.vue'
import Gallery from '../gallery/gallery.vue'
import LinkPreview from '../link-preview/link-preview.vue'
import AvatarList from '../avatar_list/avatar_list.vue'
import Timeago from '../timeago/timeago.vue'
import StatusPopover from '../status_popover/status_popover.vue'
import EmojiReactions from '../emoji_reactions/emoji_reactions.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import fileType from 'src/services/file_type/file_type.service'
import { processHtml } from 'src/services/tiny_post_html_processor/tiny_post_html_processor.service.js'
import { highlightClass, highlightStyle } from '../../services/user_highlighter/user_highlighter.js'
import { mentionMatchesUrl, extractTagFromUrl } from 'src/services/matcher/matcher.service.js'
import { filter, unescape, uniqBy } from 'lodash'
import { mapGetters, mapState } from 'vuex'

const Status = {
  name: 'Status',
  props: [
    'statusoid',
    'expandable',
    'inConversation',
    'focused',
    'highlight',
    'compact',
    'replies',
    'isPreview',
    'noHeading',
    'inlineExpanded',
    'showPinned',
    'inProfile',
    'profileUserId'
  ],
  data () {
    return {
      replying: false,
      unmuted: false,
      userExpanded: false,
      showingTall: this.inConversation && this.focused,
      showingLongSubject: false,
      error: null,
      // not as computed because it sets the initial state which will be changed later
      expandingSubject: !this.$store.getters.mergedConfig.collapseMessageWithSubject
    }
  },
  computed: {
    localCollapseSubjectDefault () {
      return this.mergedConfig.collapseMessageWithSubject
    },
    muteWords () {
      return this.mergedConfig.muteWords
    },
    repeaterClass () {
      const user = this.statusoid.user
      return highlightClass(user)
    },
    userClass () {
      const user = this.retweet ? (this.statusoid.retweeted_status.user) : this.statusoid.user
      return highlightClass(user)
    },
    deleted () {
      return this.statusoid.deleted
    },
    repeaterStyle () {
      const user = this.statusoid.user
      const highlight = this.mergedConfig.highlight
      return highlightStyle(highlight[user.screen_name])
    },
    userStyle () {
      if (this.noHeading) return
      const user = this.retweet ? (this.statusoid.retweeted_status.user) : this.statusoid.user
      const highlight = this.mergedConfig.highlight
      return highlightStyle(highlight[user.screen_name])
    },
    hideAttachments () {
      return (this.mergedConfig.hideAttachments && !this.inConversation) ||
        (this.mergedConfig.hideAttachmentsInConv && this.inConversation)
    },
    userProfileLink () {
      return this.generateUserProfileLink(this.status.user.id, this.status.user.screen_name)
    },
    replyProfileLink () {
      if (this.isReply) {
        return this.generateUserProfileLink(this.status.in_reply_to_user_id, this.replyToName)
      }
    },
    retweet () { return !!this.statusoid.retweeted_status },
    retweeter () { return this.statusoid.user.name || this.statusoid.user.screen_name },
    retweeterHtml () { return this.statusoid.user.name_html },
    retweeterProfileLink () { return this.generateUserProfileLink(this.statusoid.user.id, this.statusoid.user.screen_name) },
    status () {
      if (this.retweet) {
        return this.statusoid.retweeted_status
      } else {
        return this.statusoid
      }
    },
    statusFromGlobalRepository () {
      // NOTE: Consider to replace status with statusFromGlobalRepository
      return this.$store.state.statuses.allStatusesObject[this.status.id]
    },
    loggedIn () {
      return !!this.currentUser
    },
    muteWordHits () {
      const statusText = this.status.text.toLowerCase()
      const statusSummary = this.status.summary.toLowerCase()
      const hits = filter(this.muteWords, (muteWord) => {
        return statusText.includes(muteWord.toLowerCase()) || statusSummary.includes(muteWord.toLowerCase())
      })

      return hits
    },
    muted () { return !this.unmuted && ((!(this.inProfile && this.status.user.id === this.profileUserId) && this.status.user.muted) || (!this.inConversation && this.status.thread_muted) || this.muteWordHits.length > 0) },
    hideFilteredStatuses () {
      return this.mergedConfig.hideFilteredStatuses
    },
    hideStatus () {
      return (this.hideReply || this.deleted) || (this.muted && this.hideFilteredStatuses)
    },
    isFocused () {
      // retweet or root of an expanded conversation
      if (this.focused) {
        return true
      } else if (!this.inConversation) {
        return false
      }
      // use conversation highlight only when in conversation
      return this.status.id === this.highlight
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
      return this.status.summary.length > 900
    },
    isReply () {
      return !!(this.status.in_reply_to_status_id && this.status.in_reply_to_user_id)
    },
    replyToName () {
      if (this.status.in_reply_to_screen_name) {
        return this.status.in_reply_to_screen_name
      } else {
        const user = this.$store.getters.findUser(this.status.in_reply_to_user_id)
        return user && user.screen_name
      }
    },
    hideReply () {
      if (this.mergedConfig.replyVisibility === 'all') {
        return false
      }
      if (this.inConversation || !this.isReply) {
        return false
      }
      if (this.status.user.id === this.currentUser.id) {
        return false
      }
      if (this.status.type === 'retweet') {
        return false
      }
      const checkFollowing = this.mergedConfig.replyVisibility === 'following'
      for (var i = 0; i < this.status.attentions.length; ++i) {
        if (this.status.user.id === this.status.attentions[i].id) {
          continue
        }
        const taggedUser = this.$store.getters.findUser(this.status.attentions[i].id)
        if (checkFollowing && taggedUser && taggedUser.following) {
          return false
        }
        if (this.status.attentions[i].id === this.currentUser.id) {
          return false
        }
      }
      return this.status.attentions.length > 0
    },
    hideSubjectStatus () {
      if (this.tallStatus && !this.localCollapseSubjectDefault) {
        return false
      }
      return !this.expandingSubject && this.status.summary
    },
    hideTallStatus () {
      if (this.status.summary && this.localCollapseSubjectDefault) {
        return false
      }
      if (this.showingTall) {
        return false
      }
      return this.tallStatus
    },
    showingMore () {
      return (this.tallStatus && this.showingTall) || (this.status.summary && this.expandingSubject)
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
    replySubject () {
      if (!this.status.summary) return ''
      const decodedSummary = unescape(this.status.summary)
      const behavior = this.mergedConfig.subjectLineBehavior
      const startsWithRe = decodedSummary.match(/^re[: ]/i)
      if ((behavior !== 'noop' && startsWithRe) || behavior === 'masto') {
        return decodedSummary
      } else if (behavior === 'email') {
        return 're: '.concat(decodedSummary)
      } else if (behavior === 'noop') {
        return ''
      }
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
    hasImageAttachments () {
      return this.status.attachments.some(
        file => fileType.fileType(file.mimetype) === 'image'
      )
    },
    hasVideoAttachments () {
      return this.status.attachments.some(
        file => fileType.fileType(file.mimetype) === 'video'
      )
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
    contentHtml () {
      if (!this.status.summary_html) {
        return this.postBodyHtml
      }
      return this.status.summary_html + '<br />' + this.postBodyHtml
    },
    combinedFavsAndRepeatsUsers () {
      // Use the status from the global status repository since favs and repeats are saved in it
      const combinedUsers = [].concat(
        this.statusFromGlobalRepository.favoritedBy,
        this.statusFromGlobalRepository.rebloggedBy
      )
      return uniqBy(combinedUsers, 'id')
    },
    ownStatus () {
      return this.status.user.id === this.currentUser.id
    },
    tags () {
      return this.status.tags.filter(tagObj => tagObj.hasOwnProperty('name')).map(tagObj => tagObj.name).join(' ')
    },
    hidePostStats () {
      return this.mergedConfig.hidePostStats
    },
    ...mapGetters(['mergedConfig']),
    ...mapState({
      betterShadow: state => state.interface.browserSupport.cssFilter,
      currentUser: state => state.users.currentUser
    })
  },
  components: {
    Attachment,
    FavoriteButton,
    ReactButton,
    RetweetButton,
    ExtraButtons,
    PostStatusForm,
    Poll,
    UserCard,
    UserAvatar,
    Gallery,
    LinkPreview,
    AvatarList,
    Timeago,
    StatusPopover,
    EmojiReactions
  },
  methods: {
    visibilityIcon (visibility) {
      switch (visibility) {
        case 'private':
          return 'icon-lock'
        case 'unlisted':
          return 'icon-lock-open-alt'
        case 'direct':
          return 'icon-mail-alt'
        default:
          return 'icon-globe'
      }
    },
    showError (error) {
      this.error = error
    },
    clearError () {
      this.error = undefined
    },
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
          // Extract tag name from link url
          const tag = extractTagFromUrl(target.href)
          if (tag) {
            const link = this.generateTagLink(tag)
            this.$router.push(link)
            return
          }
        }
        window.open(target.href, '_blank')
      }
    },
    toggleReplying () {
      this.replying = !this.replying
    },
    gotoOriginal (id) {
      if (this.inConversation) {
        this.$emit('goto', id)
      }
    },
    toggleExpanded () {
      this.$emit('toggleExpanded')
    },
    toggleMute () {
      this.unmuted = !this.unmuted
    },
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    },
    toggleShowMore () {
      if (this.showingTall) {
        this.showingTall = false
      } else if (this.expandingSubject && this.status.summary) {
        this.expandingSubject = false
      } else if (this.hideTallStatus) {
        this.showingTall = true
      } else if (this.hideSubjectStatus && this.status.summary) {
        this.expandingSubject = true
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
  },
  watch: {
    'highlight': function (id) {
      if (this.status.id === id) {
        let rect = this.$el.getBoundingClientRect()
        if (rect.top < 100) {
          // Post is above screen, match its top to screen top
          window.scrollBy(0, rect.top - 100)
        } else if (rect.height >= (window.innerHeight - 50)) {
          // Post we want to see is taller than screen so match its top to screen top
          window.scrollBy(0, rect.top - 100)
        } else if (rect.bottom > window.innerHeight - 50) {
          // Post is below screen, match its bottom to screen bottom
          window.scrollBy(0, rect.bottom - window.innerHeight + 50)
        }
      }
    },
    'status.repeat_num': function (num) {
      // refetch repeats when repeat_num is changed in any way
      if (this.isFocused && this.statusFromGlobalRepository.rebloggedBy && this.statusFromGlobalRepository.rebloggedBy.length !== num) {
        this.$store.dispatch('fetchRepeats', this.status.id)
      }
    },
    'status.fave_num': function (num) {
      // refetch favs when fave_num is changed in any way
      if (this.isFocused && this.statusFromGlobalRepository.favoritedBy && this.statusFromGlobalRepository.favoritedBy.length !== num) {
        this.$store.dispatch('fetchFavs', this.status.id)
      }
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  }
}

export default Status
