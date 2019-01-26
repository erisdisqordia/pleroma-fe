import { filter, sortBy } from 'lodash'

export const notificationsFromStore = store => store.state.statuses.notifications.data

export const visibleTypes = store => ([
  store.state.config.notificationVisibility.likes && 'like',
  store.state.config.notificationVisibility.mentions && 'mention',
  store.state.config.notificationVisibility.repeats && 'repeat',
  store.state.config.notificationVisibility.follows && 'follow'
].filter(_ => _))

const sortById = (a, b) => {
  const seqA = Number(a.action.id)
  const seqB = Number(b.action.id)
  const isSeqA = !Number.isNaN(seqA)
  const isSeqB = !Number.isNaN(seqB)
  if (isSeqA && isSeqB) {
    return seqA > seqB ? -1 : 1
  } else if (isSeqA && !isSeqB) {
    return 1
  } else if (!isSeqA && isSeqB) {
    return -1
  } else {
    return a.action.id > b.action.id ? -1 : 1
  }
}

export const visibleNotificationsFromStore = store => {
  // map is just to clone the array since sort mutates it and it causes some issues
  let sortedNotifications = notificationsFromStore(store).map(_ => _).sort(sortById)
  sortedNotifications = sortBy(sortedNotifications, 'seen')
  return sortedNotifications.filter((notification) => visibleTypes(store).includes(notification.type))
}

export const unseenNotificationsFromStore = store =>
  filter(visibleNotificationsFromStore(store), ({seen}) => !seen)
