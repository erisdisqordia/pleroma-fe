
export const makeFetcher = (call, interval) => {
  let stopped = false
  let timeout = null
  let func = () => {}

  func = () => {
    call().finally(() => {
      console.log('callbacks')
      if (stopped) return
      timeout = window.setTimeout(func, interval)
    })
  }

  const stopFetcher = () => {
    stopped = true
    window.cancelTimeout(timeout)
  }

  func()

  return stopFetcher
}
