export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR
export const WEEK = 7 * DAY
export const MONTH = 30 * DAY
export const YEAR = 365.25 * DAY

export const relativeTime = (date, nowThreshold = 1) => {
  if (typeof date === 'string') date = Date.parse(date)
  const round = Date.now() > date ? Math.floor : Math.ceil
  const d = Math.abs(Date.now() - date)
  let r = { num: round(d / YEAR), key: 'time.years' }
  if (d < nowThreshold * SECOND) {
    r.num = 0
    r.key = 'time.now'
  } else if (d < MINUTE) {
    r.num = round(d / SECOND)
    r.key = 'time.seconds'
  } else if (d < HOUR) {
    r.num = round(d / MINUTE)
    r.key = 'time.minutes'
  } else if (d < DAY) {
    r.num = round(d / HOUR)
    r.key = 'time.hours'
  } else if (d < WEEK) {
    r.num = round(d / DAY)
    r.key = 'time.days'
  } else if (d < MONTH) {
    r.num = round(d / WEEK)
    r.key = 'time.weeks'
  } else if (d < YEAR) {
    r.num = round(d / MONTH)
    r.key = 'time.months'
  }
  // Remove plural form when singular
  if (r.num === 1) r.key = r.key.slice(0, -1)
  return r
}

export const relativeTimeShort = (date, nowThreshold = 1) => {
  const r = relativeTime(date, nowThreshold)
  r.key += '_short'
  return r
}
