export default (store) => {
  store.subscribe((mutation, state) => {
    const vapidPublicKey = state.instance.vapidPublicKey
    const webPushNotification = state.config.webPushNotifications
    const permission = state.interface.notificationPermission === 'granted'
    const user = state.users.currentUser

    const isUserMutation = mutation.type === 'setCurrentUser'
    const isVapidMutation = mutation.type === 'setInstanceOption' && mutation.payload.name === 'vapidPublicKey'
    const isPermMutation = mutation.type === 'setNotificationPermission' && mutation.payload === 'granted'
    const isUserConfigMutation = mutation.type === 'setOption' && mutation.payload.name === 'webPushNotifications'
    const isVisibilityMutation = mutation.type === 'setOption' && mutation.payload.name === 'notificationVisibility'

    if (isUserMutation || isVapidMutation || isPermMutation || isUserConfigMutation || isVisibilityMutation) {
      if (user && vapidPublicKey && permission && webPushNotification) {
        return store.dispatch('registerPushNotifications')
      } else if (isUserConfigMutation && !webPushNotification) {
        return store.dispatch('unregisterPushNotifications')
      }
    }
  })
}
