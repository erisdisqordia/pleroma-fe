import { filter, sortBy, includes } from 'lodash'

export const notificationsFromStore = store => store.state.statuses.notifications.data

export const visibleTypes = store => ([
  store.state.config.notificationVisibility.likes && 'like',
  store.state.config.notificationVisibility.mentions && 'mention',
  store.state.config.notificationVisibility.repeats && 'repeat',
  store.state.config.notificationVisibility.follows && 'follow',
  store.state.config.notificationVisibility.followRequest && 'follow_request',
  store.state.config.notificationVisibility.moves && 'move',
  store.state.config.notificationVisibility.emojiReactions && 'pleroma:emoji_reaction'
].filter(_ => _))

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
