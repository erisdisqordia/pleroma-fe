import { filter, sortBy, includes } from 'lodash'
import { muteWordHits } from '../status_parser/status_parser.js'
import { showDesktopNotification } from '../desktop_notification_utils/desktop_notification_utils.js'

export const notificationsFromStore = store => store.state.statuses.notifications.data

export const visibleTypes = store => {
  const rootState = store.rootState || store.state

  return ([
    rootState.config.notificationVisibility.likes && 'like',
    rootState.config.notificationVisibility.mentions && 'mention',
    rootState.config.notificationVisibility.repeats && 'repeat',
    rootState.config.notificationVisibility.follows && 'follow',
    rootState.config.notificationVisibility.followRequest && 'follow_request',
    rootState.config.notificationVisibility.moves && 'move',
    rootState.config.notificationVisibility.emojiReactions && 'pleroma:emoji_reaction'
  ].filter(_ => _))
}

const statusNotifications = ['like', 'mention', 'repeat', 'pleroma:emoji_reaction']

export const isStatusNotification = (type) => includes(statusNotifications, type)

const sortById = (a, b) => {
  const seqA = Number(a.id)
  const seqB = Number(b.id)
  const isSeqA = !Number.isNaN(seqA)
  const isSeqB = !Number.isNaN(seqB)
  if (isSeqA && isSeqB) {
    return seqA > seqB ? -1 : 1
  } else if (isSeqA && !isSeqB) {
    return 1
  } else if (!isSeqA && isSeqB) {
    return -1
  } else {
    return a.id > b.id ? -1 : 1
  }
}

const isMutedNotification = (store, notification) => {
  if (!notification.status) return
  return notification.status.muted || muteWordHits(notification.status, store.rootGetters.mergedConfig.muteWords).length > 0
}

export const maybeShowNotification = (store, notification) => {
  const rootState = store.rootState || store.state

  if (notification.seen) return
  if (!visibleTypes(store).includes(notification.type)) return
  if (notification.type === 'mention' && isMutedNotification(store, notification)) return

  const notificationObject = prepareNotificationObject(notification, store.rootGetters.i18n)
  showDesktopNotification(rootState, notificationObject)
}

export const filteredNotificationsFromStore = (store, types) => {
  // map is just to clone the array since sort mutates it and it causes some issues
  let sortedNotifications = notificationsFromStore(store).map(_ => _).sort(sortById)
  sortedNotifications = sortBy(sortedNotifications, 'seen')
  return sortedNotifications.filter(
    (notification) => (types || visibleTypes(store)).includes(notification.type)
  )
}

export const unseenNotificationsFromStore = store =>
  filter(filteredNotificationsFromStore(store), ({ seen }) => !seen)

export const prepareNotificationObject = (notification, i18n) => {
  const notifObj = {
    tag: notification.id
  }
  const status = notification.status
  const title = notification.from_profile.name
  notifObj.title = title
  notifObj.icon = notification.from_profile.profile_image_url
  let i18nString
  switch (notification.type) {
    case 'like':
      i18nString = 'favorited_you'
      break
    case 'repeat':
      i18nString = 'repeated_you'
      break
    case 'follow':
      i18nString = 'followed_you'
      break
    case 'move':
      i18nString = 'migrated_to'
      break
    case 'follow_request':
      i18nString = 'follow_request'
      break
  }

  if (notification.type === 'pleroma:emoji_reaction') {
    notifObj.body = i18n.t('notifications.reacted_with', [notification.emoji])
  } else if (i18nString) {
    notifObj.body = i18n.t('notifications.' + i18nString)
  } else if (isStatusNotification(notification.type)) {
    notifObj.body = notification.status.text
  }

  // Shows first attached non-nsfw image, if any. Should add configuration for this somehow...
  if (status && status.attachments && status.attachments.length > 0 && !status.nsfw &&
    status.attachments[0].mimetype.startsWith('image/')) {
    notifObj.image = status.attachments[0].url
  }

  return notifObj
}
