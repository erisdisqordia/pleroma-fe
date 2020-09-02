
// makeFetcher - replacement for setInterval for fetching, starts counting
// the interval only after a request is done instead of immediately.
// promiseCall is a function that returns a promise, it's called when created
// and after every interval.
// interval is the interval delay in ms.

export const makeFetcher = (promiseCall, interval) => {
  let stopped = false
  let timeout = null
  let func = () => {}

  func = () => {
    promiseCall().finally(() => {
      if (stopped) return
      timeout = window.setTimeout(func, interval)
    })
  }

  const stopFetcher = () => {
    stopped = true
    window.clearTimeout(timeout)
  }

  func()

  return stopFetcher
}
