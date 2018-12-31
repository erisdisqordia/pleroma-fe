import { filter, sortBy } from 'lodash'

export const notificationsFromStore = store => store.state.statuses.notifications.data

export const visibleTypes = store => ([
  store.state.config.notificationVisibility.likes && 'like',
  store.state.config.notificationVisibility.mentions && 'mention',
  store.state.config.notificationVisibility.repeats && 'repeat',
  store.state.config.notificationVisibility.follows && 'follow'
].filter(_ => _))

export const visibleNotificationsFromStore = store => {
  // Don't know why, but sortBy([seen, -action.id]) doesn't work.
  let sortedNotifications = sortBy(notificationsFromStore(store), ({action}) => -action.id)
  sortedNotifications = sortBy(sortedNotifications, 'seen')
  return sortedNotifications.filter((notification) => visibleTypes(store).includes(notification.type))
}

export const unseenNotificationsFromStore = store =>
  filter(visibleNotificationsFromStore(store), ({seen}) => !seen)
