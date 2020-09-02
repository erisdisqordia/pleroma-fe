
export const makeFetcher = (call, interval) => {
  let stopped = false
  let timeout = null
  let func = () => {}

  func = () => {
    call().finally(() => {
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
