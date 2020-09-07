export const showDesktopNotification = (rootState, desktopNotificationOpts) => {
  if (!('Notification' in window && window.Notification.permission === 'granted')) return
  if (rootState.statuses.notifications.desktopNotificationSilence) { return }

  const desktopNotification = new window.Notification(desktopNotificationOpts.title, desktopNotificationOpts)
  // Chrome is known for not closing notifications automatically
  // according to MDN, anyway.
  setTimeout(desktopNotification.close.bind(desktopNotification), 5000)
}
