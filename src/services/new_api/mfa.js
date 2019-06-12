const verifyOTPCode = ({app, instance, mfaToken, code}) => {
  const url = `${instance}/oauth/mfa/challenge`
  const form = new window.FormData()

  form.append('client_id', app.client_id)
  form.append('client_secret', app.client_secret)
  form.append('mfa_token', mfaToken)
  form.append('code', code)
  form.append('challenge_type', 'totp')

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const verifyRecoveryCode = ({app, instance, mfaToken, code}) => {
  const url = `${instance}/oauth/mfa/challenge`
  const form = new window.FormData()

  form.append('client_id', app.client_id)
  form.append('client_secret', app.client_secret)
  form.append('mfa_token', mfaToken)
  form.append('code', code)
  form.append('challenge_type', 'recovery')

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const mfa = {
  verifyOTPCode,
  verifyRecoveryCode
}

export default mfa
