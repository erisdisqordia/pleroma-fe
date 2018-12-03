import {capitalize, reduce} from 'lodash'

export function humanizeErrors (errors) {
  return reduce(errors, (errs, val, k) => {
    let message = reduce(val, (acc, message) => {
      let key = capitalize(k.replace(/_/g, ' '))
      return acc + [key, message].join(' ') + '. '
    }, '')
    return [...errs, message]
  }, [])
}

