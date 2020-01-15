import { humanizeErrors } from '../../modules/errors'

export function StatusCodeError (statusCode, body, options, response) {
  this.name = 'StatusCodeError'
  this.statusCode = statusCode
  this.message = statusCode + ' - ' + (JSON && JSON.stringify ? JSON.stringify(body) : body)
  this.error = body // legacy attribute
  this.options = options
  this.response = response

  if (Error.captureStackTrace) { // required for non-V8 environments
    Error.captureStackTrace(this)
  }
}
StatusCodeError.prototype = Object.create(Error.prototype)
StatusCodeError.prototype.constructor = StatusCodeError

export class RegistrationError extends Error {
  constructor (error) {
    super()
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this)
    }

    try {
      // the error is probably a JSON object with a single key, "errors", whose value is another JSON object containing the real errors
      if (typeof error === 'string') {
        error = JSON.parse(error)
        if (error.hasOwnProperty('error')) {
          error = JSON.parse(error.error)
        }
      }

      if (typeof error === 'object') {
        const errorContents = JSON.parse(error.error)
        // keys will have the property that has the error, for example 'ap_id',
        // 'email' or 'captcha', the value will be an array of its error
        // like "ap_id": ["has been taken"] or "captcha": ["Invalid CAPTCHA"]

        // replace ap_id with username
        if (errorContents.ap_id) {
          errorContents.username = errorContents.ap_id
          delete errorContents.ap_id
        }

        this.message = humanizeErrors(errorContents)
      } else {
        this.message = error
      }
    } catch (e) {
      // can't parse it, so just treat it like a string
      this.message = error
    }
  }
}
