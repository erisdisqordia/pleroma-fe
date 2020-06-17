import EventTargetPolyfill from '@ungap/event-target'

try {
  /* eslint-disable no-new  */
  new EventTarget()
  /* eslint-enable no-new  */
} catch (e) {
  window.EventTarget = EventTargetPolyfill
}
