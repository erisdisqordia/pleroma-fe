
// promiseInterval - replacement for setInterval for promises, starts counting
// the interval only after a promise is done instead of immediately.
// - promiseCall is a function that returns a promise, it's called the first
// time after the first interval.
// - interval is the interval delay in ms.

export const promiseInterval = (promiseCall, interval) => {
  let stopped = false
  let timeout = null

  const func = () => {
    const promise = promiseCall()
    // something unexpected happened and promiseCall did not
    // return a promise, abort the loop.
    if (!(promise && promise.finally)) {
      console.warn('promiseInterval: promise call did not return a promise, stopping interval.')
      return
    }
    promise.finally(() => {
      if (stopped) return
      timeout = window.setTimeout(func, interval)
    })
  }

  const stopFetcher = () => {
    stopped = true
    window.clearTimeout(timeout)
  }

  timeout = window.setTimeout(func, interval)

  return { stop: stopFetcher }
}
